/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Info,
  ChevronLeft,
  ChevronsRight,
  FileText,
  History as LucideHistory,
  AlertTriangle,
  ShieldAlert,
  Lightbulb,
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { parseCookies } from 'nookies'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SystemFormsProps {
  projectId: string
  kickOffDate: Date
  onBack: () => void
  projectTitle: string
}

type SystemFormValues = {
  vision: string
  pastGoodOldDays: string
  obstacleProblem: string
  riskOfInaction: string
  solutionIdea: string
}

export default function SystemForms({
  projectId,
  kickOffDate,
  onBack,
  projectTitle,
}: SystemFormsProps) {
  const session = useSession()
  const token = (session?.data?.user as { accessToken?: string })?.accessToken
  const router = useRouter()
  const [language, setLanguage] = useState<'en' | 'de'>('en')

  useEffect(() => {
    const cookies = parseCookies()
    const googtrans = cookies.googtrans
    if (googtrans) {
      const lang = googtrans.split('/')[2]
      if (lang === 'de' || lang === 'en') {
        setLanguage(lang as 'en' | 'de')
      }
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SystemFormValues>()

  const { data: systemSettings } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/system-setting`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok) throw new Error('Failed to fetch system settings')
      return res.json()
    },
    enabled: !!token,
  })

  const submitMutation = useMutation({
    mutationFn: async (values: SystemFormValues) => {
      const participantName =
        localStorage.getItem('userName') ||
        session.data?.user?.name ||
        'Anonymous'
      const organization = 'Tech Solutions Ltd, Bangladesh'

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/insight-engine/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            participantName,
            organization,
            projectTitle,
            kickOffDate: kickOffDate.toISOString(),
            systemForms: {
              vision: values.vision,
              pastGoodOldDays: values.pastGoodOldDays,
              obstacleProblem: values.obstacleProblem,
              riskOfInaction: values.riskOfInaction,
              solutionIdea: values.solutionIdea,
            },
          }),
        },
      )

      if (!res.ok) throw new Error('Failed to submit form')
      return res.json()
    },
    onSuccess: () => {
      toast.success('System forms submitted successfully')
      router.push('/participants')
    },
    onError: error => {
      toast.error(error.message || 'Something went wrong')
    },
  })

  const getHelpText = (name: string) => {
    const item = systemSettings?.data?.items?.find(
      (i: any) => i.helpTexts && i.helpTexts.length > 0,
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const help = item?.helpTexts?.find((h: any) => h.name === name)
    return help?.values?.[language] || help?.values?.en || ''
  }

  const onSubmit = (values: SystemFormValues) => {
    submitMutation.mutate(values)
  }

  return (
    <div className="w-full space-y-8 pb-10">
      <div className="space-y-2">
        <h1 className="text-[32px] font-semibold text-[#00253E]">
          {projectTitle}
        </h1>
        <div className="flex items-center gap-2 text-[#00253E]/80">
          <FileText className="w-5 h-5" />
          <span className="text-[18px] font-medium">
            Kick off :{' '}
            {new Intl.DateTimeFormat(
              language === 'de' ? 'de-DE' : 'en-GB',
            ).format(kickOffDate)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8">
          {/* Vision */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00253E]/60" />
              <label className="text-[20px] font-medium text-[#00253E]">
                Vision
              </label>
              <HelpIcon text={getHelpText('Vision')} />
            </div>
            <Textarea
              {...register('vision')}
              placeholder="What will the further look like?"
              className="min-h-[100px] border-[#00253E]/20 rounded-[4px] focus-visible:ring-primary shadow-sm text-[16px]"
            />
          </div>

          {/* Past */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LucideHistory className="w-5 h-5 text-[#00253E]/60" />
              <label className="text-[20px] font-medium text-[#00253E]">
                The past (good old days)
              </label>
              <HelpIcon text={getHelpText('The past (good old days)')} />
            </div>
            <Textarea
              {...register('pastGoodOldDays')}
              placeholder="Describe how this were in the past.."
              className="min-h-[100px] border-[#00253E]/20 rounded-[4px] focus-visible:ring-primary shadow-sm text-[16px]"
            />
          </div>

          {/* Obstacle */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#00253E]/60" />
              <label className="text-[20px] font-medium text-[#00253E]">
                Obstacle / Problem
              </label>
              <HelpIcon text={getHelpText('Obstacle / Problem')} />
            </div>
            <Textarea
              {...register('obstacleProblem')}
              placeholder="what problem are you Facing?"
              className="min-h-[100px] border-[#00253E]/20 rounded-[4px] focus-visible:ring-primary shadow-sm text-[16px]"
            />
          </div>

          {/* Risk */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#00253E]/60" />
              <label className="text-[20px] font-medium text-[#00253E]">
                Risk of inaction / Consequences
              </label>
              <HelpIcon text={getHelpText('Risk of inaction / Consequences')} />
            </div>
            <Textarea
              {...register('riskOfInaction')}
              placeholder="What happens if we don't change?"
              className="min-h-[100px] border-[#00253E]/20 rounded-[4px] focus-visible:ring-primary shadow-sm text-[16px]"
            />
          </div>

          {/* Solution */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#00253E]/60" />
              <label className="text-[20px] font-medium text-[#00253E]">
                Solution / Idea
              </label>
              <HelpIcon text={getHelpText('Solution / Idea')} />
            </div>
            <Textarea
              {...register('solutionIdea')}
              placeholder="what's the solutions?"
              className="min-h-[100px] border-[#00253E]/20 rounded-[4px] focus-visible:ring-primary shadow-sm text-[16px]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-[48px] px-8 rounded-[8px] flex items-center gap-2 border-[#00253E]/20 text-[#00253E] hover:bg-gray-50 bg-white"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </Button>

          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-[#00253E] px-12 h-[48px] rounded-[8px] flex items-center gap-2 font-semibold transition-all duration-200 active:scale-95"
          >
            {submitMutation.isPending ? 'Submitting...' : 'Continue'}
            <ChevronsRight className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}

function HelpIcon({ text }: { text: string }) {
  if (!text) return null
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="outline-none">
            <Info className="w-5 h-5 text-[#00253E]/60 hover:text-[#00253E] cursor-pointer" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          className="max-w-[400px] bg-[#00253E] text-white p-3 rounded-[4px] shadow-2xl border-t-4 border-primary animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-[14px] leading-relaxed">{text}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
