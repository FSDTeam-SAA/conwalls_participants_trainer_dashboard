'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import KickOffDateForm from './_components/kick-off-date-form'
import SystemForms from './_components/system-forms'
import StakeholderList from './_components/stakeholder-list'
import { Loader2 } from 'lucide-react'
import StepNavigation from './_components/step-navigation'
import { Scroll, Users, ClipboardList, Clock } from 'lucide-react'
import Timetable from './_components/timetable'



export default function InsightEnginePage() {
  const { projectId } = useParams() as { projectId: string }
  const session = useSession()
  const token = (session?.data?.user as { accessToken?: string })?.accessToken

  const [step, setStep] = useState(1)
  const [kickOffDate, setKickOffDate] = useState<Date>()
  const [activeSubStep, setActiveSubStep] = useState<'Trigger' | 'Measures' | null>(null)

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

  const projectTitle = projectData?.data?.projectTitle || 'Project';

  const STEPS = [
    { id: 1, title: projectTitle, icon: Scroll },
    { id: 2, title: 'Stakeholder', icon: Users },
    { id: 3, title: activeSubStep === 'Trigger' ? 'Trigger' : 'Measures', icon: ClipboardList },
    { id: 4, title: 'Timetable', icon: Clock },
  ];

  let displaySteps = STEPS;
  if (activeSubStep) {
    displaySteps = STEPS.slice(0, 3);
  }

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
        currentStep={step}
        steps={displaySteps}
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
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <StakeholderList
          projectId={projectId}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
          onSubStepChange={setActiveSubStep}
        />
      )}

      {step === 4 && kickOffDate && (
        <Timetable
          projectId={projectId}
          projectTitle={projectTitle}
          kickOffDate={kickOffDate}
        />
      )}
    </div>
  )
}
