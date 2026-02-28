'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Loader2, Download, Grid, List, Clock, User, ChevronLeft } from 'lucide-react'
import { Stakeholder } from './stakeholder-types'
import { Measure } from './measure-types'

interface TimetableProps {
    projectId: string
    projectTitle: string
    kickOffDate: Date
}

export default function Timetable({ projectId, projectTitle, kickOffDate }: TimetableProps) {
    const session = useSession()
    const token = (session?.data?.user as { accessToken?: string })?.accessToken

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const { data, isLoading } = useQuery({
        queryKey: ['stakeholders-measures', projectId],
        queryFn: async () => {
            const stRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stakeholder/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!stRes.ok) throw new Error('Failed to fetch stakeholders')
            const stData = await stRes.json()
            const stakeholders: Stakeholder[] = stData.data || []

            const measuresMap = new Map<string, Measure[]>()

            await Promise.all(
                stakeholders.map(async (sh) => {
                    const mRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/measure/${projectId}/stakeholders/${sh._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (mRes.ok) {
                        const mData = await mRes.json()
                        measuresMap.set(sh._id, mData.data || [])
                    }
                })
            )

            return stakeholders.map(sh => ({
                ...sh,
                measures: measuresMap.get(sh._id) || []
            }))
        },
        enabled: !!token && !!projectId,
    })

    const getCategoryColor = (category: string) => {
        const cat = category?.toLowerCase() || ''
        if (cat.includes('communication')) return '#B5CC2E'
        if (cat.includes('involvement')) return '#00253E'
        if (cat.includes('recognition')) return '#A91D54'
        return '#9CA3AF'
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const stakeholdersWithMeasures = data || []

    // Calculate timeline bounds
    const maxWeeksPre = stakeholdersWithMeasures.reduce((max, sh) => {
        const shMax = sh.measures?.filter(m => m.timing === 'pre').reduce((m, m2) => Math.max(m, m2.startWeeks), 0) || 0
        return Math.max(max, shMax)
    }, 0)

    const maxWeeksPost = stakeholdersWithMeasures.reduce((max, sh) => {
        const shMax = sh.measures?.filter(m => m.timing === 'post').reduce((m, m2) => Math.max(m, m2.startWeeks), 0) || 0
        return Math.max(max, shMax)
    }, 0)

    const timelineStartBuffer = Math.max(1, maxWeeksPre + 2)
    const timelineEndBuffer = Math.max(1, maxWeeksPost + 2)
    const totalWeeks = timelineStartBuffer + timelineEndBuffer

    const handlePrint = () => {
        window.print()
    }

    const formattedStartDate = kickOffDate
        ? new Date(kickOffDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' - ')
        : '08 - 02 - 2026'

    return (
        <div className="space-y-8 pb-10 w-full max-w-6xl mx-auto font-sans">
            {/* Header Section */}
            <div className="flex flex-col gap-6 pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <button className="flex items-center gap-1 text-[12px] text-gray-500 hover:text-[#00253E] transition-colors mb-2 print:hidden">
                            <ChevronLeft className="w-3 h-3" />
                            Go Back
                        </button>
                        <h2 className="text-[18px] font-medium text-[#00253E]">Project List</h2>
                        <div className="flex items-center gap-2 text-[13px] text-gray-500">
                            <span>{projectTitle || "New ERP System"}</span>
                            <span className="text-gray-400">&gt;</span>
                            <span className="text-[#00253E] font-medium">Time Table</span>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div className="flex bg-gray-100 p-1 rounded-md h-[40px] w-[220px] print:hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex-1 rounded-md text-[13px] font-medium transition-colors flex items-center justify-center gap-2 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00253E]' : 'text-gray-500 hover:text-[#00253E]'}`}
                            >
                                <Grid className="w-4 h-4" />
                                Grid View
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex-1 rounded-md text-[13px] font-medium transition-colors flex items-center justify-center gap-2 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00253E]' : 'text-gray-500 hover:text-[#00253E]'}`}
                            >
                                <List className="w-4 h-4" />
                                List View
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 text-[13px] font-medium pt-1">
                            <div className="flex items-center gap-3 text-[#00253E]">
                                <span className="w-[18px] h-[18px] bg-[#B5CC2E] rounded-sm"></span> Communication
                            </div>
                            <div className="flex items-center gap-3 text-[#00253E]">
                                <span className="w-[18px] h-[18px] bg-[#00253E] rounded-sm"></span> Involvement
                            </div>
                            <div className="flex items-center gap-3 text-[#00253E]">
                                <span className="w-[18px] h-[18px] bg-[#A91D54] rounded-sm"></span> Recognition
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-[#00253E] font-medium text-[15px] pt-2">
                    Start : {formattedStartDate}
                </div>
            </div>

            {/* Content per Stakeholder */}
            {stakeholdersWithMeasures.map(sh => (
                <div key={sh._id} className="mb-12 block print:break-inside-avoid">
                    {/* Stakeholder Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="h-[36px] px-4 bg-white border border-gray-200 border-l-[4px] border-l-[#B5CC2E] rounded flex items-center gap-2 shadow-sm">
                                <User className="w-4 h-4 text-[#B5CC2E]" />
                                <span className="text-[14px] font-bold text-[#00253E]">{sh.name}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 print:hidden">
                            <button onClick={handlePrint} className="h-[36px] px-4 bg-white border border-gray-200 rounded text-[13px] font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                                <Download className="w-4 h-4" />
                                Export PDF
                            </button>
                            {viewMode === 'list' && (
                                <button className="h-[36px] px-4 bg-[#B5CC2E] rounded text-[13px] font-medium text-[#00253E] flex items-center gap-2 hover:bg-[#A3B829] transition-colors shadow-sm">
                                    <Clock className="w-4 h-4" />
                                    Timetable
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Timeline / List View Rendering */}
                    {(!sh.measures || sh.measures.length === 0) ? (
                        <p className="text-gray-400 text-center py-10 italic">No measures added for this stakeholder.</p>
                    ) : viewMode === 'list' ? (
                        <div className="flex flex-col gap-3">
                            {sh.measures.map(m => (
                                <div key={m._id} className="bg-[#F8F9FA] border border-gray-100 rounded-lg p-5 flex flex-row items-center relative overflow-hidden">
                                    {/* Left colored accent based on category */}
                                    <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ backgroundColor: getCategoryColor(m.category) }}></div>

                                    <div className="w-[120px] text-[14px] font-bold text-[#00253E]">
                                        {m.timing === 'pre' ? 'Week' : 'Week'} {m.startWeeks}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="text-[18px] font-bold text-[#00253E]">
                                            {m.type} - {m.name}
                                        </div>
                                        <div className="flex">
                                            <span className="inline-flex px-4 py-0.5 rounded-full text-[11px] font-bold text-white tracking-wide" style={{ backgroundColor: getCategoryColor(m.category) }}>
                                                {m.category?.toUpperCase() || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Ambassador row from image */}
                            <div className="bg-[#F8F9FA] border border-gray-100 rounded-lg p-5 mt-2 flex items-center text-[18px] font-bold text-[#00253E]">
                                <span className="mr-2">Change Ambassador :</span>
                                <span className="text-[#00253E] font-medium text-[14px]">Conwalls_gmbh</span>
                            </div>
                        </div>
                    ) : (
                        // Grid View (Timeline)
                        <div className="relative pt-20 pb-40 px-8 bg-white overflow-x-auto min-w-full print:overflow-visible">
                            <div className="min-w-[1000px] relative h-[400px]">
                                {/* Horizontal Timeline Axis */}
                                <div className="absolute top-[180px] left-0 right-0 h-[36px] flex shadow-inner rounded-sm overflow-hidden border border-gray-200">
                                    {/* Split colored bars */}
                                    <div className="h-full bg-[#D7A8BA]" style={{ width: `${(timelineStartBuffer / totalWeeks) * 100}%` }}></div>
                                    <div className="h-full bg-[#829DB5] flex-1"></div>

                                    {/* Tick marks on the axis */}
                                    <div className="absolute inset-0 flex">
                                        {[...Array(totalWeeks + 1)].map((_, i) => (
                                            <div key={i} className="flex-1 border-r border-[#00253E]/10 last:border-0 relative">
                                                {/* Start vertical line indicator */}
                                                {i === timelineStartBuffer && (
                                                    <div className="absolute top-[-80px] left-0 -translate-x-1/2 flex flex-col items-center">
                                                        <div className="bg-white border border-gray-100 shadow-md px-4 py-2 rounded-md mb-2 flex flex-col items-center z-30">
                                                            <span className="text-[13px] font-extrabold text-[#00253E]">Start</span>
                                                            <span className="text-[10px] text-gray-500 font-medium">17.08.2025</span>
                                                        </div>
                                                        <div className="w-[3px] h-[300px] bg-[#A91D54] z-20"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Measure Markers */}
                                {sh.measures.map((m, idx) => {
                                    const isPre = m.timing === 'pre'
                                    const weekPos = isPre ? (timelineStartBuffer - m.startWeeks) : (timelineStartBuffer + m.startWeeks)
                                    const xPos = (weekPos / totalWeeks) * 100

                                    // Vertical positioning: staggered above and below
                                    const isAbove = idx % 2 === 0
                                    const row = idx % 3
                                    const yPos = isAbove ? (40 + row * 45) : (250 + row * 45)
                                    const lineHeight = isAbove ? (180 - yPos) : (yPos - 216)

                                    return (
                                        <div key={m._id} className="absolute z-20" style={{ left: `${xPos}%`, top: `${yPos}px`, transform: 'translateX(-50%)' }}>
                                            <div className="flex items-start gap-2 bg-white rounded p-1 whitespace-nowrap min-w-[140px]">
                                                <div className="w-[16px] h-[16px] mt-1 flex-shrink-0 rounded-sm" style={{ backgroundColor: getCategoryColor(m.category) }}></div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[13px] font-bold text-[#00253E] leading-tight">{m.type}</span>
                                                    <span className="text-[11px] text-[#00253E] font-medium leading-tight opacity-90 max-w-[120px] truncate">{m.name}</span>
                                                    <span className="text-[10px] text-[#00253E]/70 font-bold mt-0.5">{m.startWeeks} Weeks</span>
                                                </div>
                                            </div>
                                            {/* Connecting line to timeline axis */}
                                            <div className={`absolute left-1/2 w-[1px] bg-gray-400/60 z-10 ${isAbove ? 'top-full' : 'bottom-full'}`} style={{ height: `${lineHeight}px` }}></div>
                                        </div>
                                    )
                                })}

                                {/* Special Ambassador Node from Image */}
                                <div className="absolute z-20" style={{ left: `${((timelineStartBuffer + 2) / totalWeeks) * 100}%`, top: '320px', transform: 'translateX(-50%)' }}>
                                    <div className="flex items-start gap-2 bg-white rounded p-1 whitespace-nowrap">
                                        <div className="w-[16px] h-[16px] mt-1 flex-shrink-0 rounded-sm bg-[#A91D54]"></div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[13px] font-bold text-[#00253E] leading-tight">Change Ambassador</span>
                                            <span className="text-[11px] text-[#00253E] font-medium leading-tight opacity-90">Tim krawchik</span>
                                            <span className="text-[10px] text-[#00253E]/70 font-bold mt-0.5">5 weeks</span>
                                        </div>
                                    </div>
                                    <div className="absolute left-1/2 bottom-full w-[1px] bg-gray-400/60 z-10 h-[104px]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
