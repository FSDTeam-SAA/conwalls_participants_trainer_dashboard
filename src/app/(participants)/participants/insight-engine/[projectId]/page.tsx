'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import KickOffDateForm from './_components/kick-off-date-form'
import SystemForms from './_components/system-forms'
import { Loader2 } from 'lucide-react'
import StepNavigation from './_components/step-navigation'
import { Scroll, Users, ClipboardList, Clock } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'New ERP-System', icon: Scroll },
  { id: 2, title: 'Stakeholder', icon: Users },
  { id: 3, title: 'Measures', icon: ClipboardList },
  { id: 4, title: 'Timetable', icon: Clock },
]

export default function InsightEnginePage() {
  const { projectId } = useParams() as { projectId: string }
  const session = useSession()
  const token = (session?.data?.user as { accessToken?: string })?.accessToken

  const [step, setStep] = useState(1)
  const [kickOffDate, setKickOffDate] = useState<Date>()

  const { data: projectData, isLoading: isProjectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/insight-engine/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok) throw new Error('Failed to fetch project')
      return res.json()
    },
    enabled: !!token && !!projectId,
  })

  const projectTitle = projectData?.data?.projectTitle || 'Project'

  if (isProjectLoading || !session.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className=" mx-auto py-6 px-4 w-full">
      <StepNavigation
        currentStep={step > 2 ? step : 1} // Simplified for demo
        steps={STEPS}
      />

      {step === 1 && !kickOffDate && (
        <KickOffDateForm
          projectTitle={projectTitle}
          onNext={date => {
            setKickOffDate(date)
            setStep(2)
          }}
        />
      )}

      {step === 2 && kickOffDate && (
        <SystemForms
          projectId={projectId}
          projectTitle={projectTitle}
          kickOffDate={kickOffDate}
          onBack={() => {
            setKickOffDate(undefined)
            setStep(1)
          }}
        />
      )}

      {step === 3 && (
        <div className="p-10 border border-dashed rounded-xl flex items-center justify-center text-gray-500">
          Stakeholder step coming soon...
        </div>
      )}

      {step === 4 && (
        <div className="p-10 border border-dashed rounded-xl flex items-center justify-center text-gray-500">
          Measures step coming soon...
        </div>
      )}
    </div>
  )
}
