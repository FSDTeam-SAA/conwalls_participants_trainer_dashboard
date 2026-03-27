'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { ChevronLeft, ChevronsRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useSystemSettings } from '@/hooks/use-system-settings'
import { parseCookies } from 'nookies'

interface StakeholderFormProps {
    projectId: string
    onCancel: () => void
    onSuccess: () => void
}

type FormValues = {
    name: string
}

const COOKIE_NAME = "googtrans";

export default function StakeholderForm({
    projectId,
    onCancel,
    onSuccess,
}: StakeholderFormProps) {
    const session = useSession()
    const token = (session?.data?.user as { accessToken?: string })?.accessToken
    const queryClient = useQueryClient()

      const cookie = parseCookies()[COOKIE_NAME];
      const lang = cookie?.split("/")?.[2] || "de";

    const { register, handleSubmit } = useForm<FormValues>()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: systemSettings } = useSystemSettings()

    const submitMutation = useMutation({
        mutationFn: async (values: FormValues) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/stakeholder/${projectId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(values),
                }
            )
            if (!res.ok) throw new Error('Failed to create stakeholder')
            return res.json()
        },
        onSuccess: () => {
            toast.success(
                lang === 'de'
                    ? 'Stakeholder erfolgreich erstellt'
                    : 'Stakeholder created successfully'
            )
            queryClient.invalidateQueries({ queryKey: ['stakeholders', projectId] })
            onSuccess()
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Something went wrong')
        },
    })

    // Basic stakeholder creation only needs the name according to Figma. Trigger evaluation happens in the Trigger step.

    const onSubmit = (values: FormValues) => {
        submitMutation.mutate(values)
    }

    return (
        <div className="w-full max-w-2xl space-y-8 pb-10">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#00253E]/60" />
                        <label className="text-[20px] font-medium text-[#00253E] notranslate">
                            {lang === 'de'
                                ? 'Geben Sie den Namen der Zielperson / Zielgruppe ein'
                                : 'Enter the name of the target person / group'}
                        </label>
                    </div>
                    <Input
                        {...register('name', { required: true })}
                        placeholder={
                            lang === 'de'
                                ? 'z. B. Buchhaltung, IT-Abteilung, Vertriebsteam'
                                : 'e.g. Accounting, IT Department, Sales team'
                        }
                        className="h-[48px] border-[#00253E] text-[16px] rounded-[4px] focus-visible:ring-primary shadow-sm placeholder:text-[#9CA3AF]"
                    />
                </div>

                <div className="flex items-center justify-between pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="h-[48px] px-8 rounded-[8px] flex items-center gap-2 font-medium border-primary text-[#00253E] hover:bg-gray-50 bg-white notranslate"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        {lang === 'de' ? 'Zuruck' : 'Back'}
                    </Button>

                    <Button
                        type="submit"
                        disabled={submitMutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-[#00253E] px-8 h-[48px] rounded-[8px] flex items-center gap-2 font-semibold transition-all duration-200 notranslate"
                    >
                        {submitMutation.isPending
                            ? lang === 'de'
                                ? 'Wird hinzugefugt...'
                                : 'Adding...'
                            : lang === 'de'
                                ? 'Hinzufugen'
                                : 'Add'}
                        <ChevronsRight className="w-5 h-5" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
