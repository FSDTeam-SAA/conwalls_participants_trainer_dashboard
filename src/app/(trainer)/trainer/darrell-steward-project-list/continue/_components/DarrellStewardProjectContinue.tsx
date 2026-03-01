"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, User, AlarmClockPlus, CopyMinus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Stakeholder {
  _id: string;
  name: string;
  roleType: string;
  insightEngineId: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: Stakeholder[];
}

export default function DarrellStewardProjectContinue() {
  const params = useParams();
  const projectId = params?.id as string;
  const session = useSession();
  const TOKEN = session.data?.user?.accessToken;

  const { data: stakeholderData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["stakeholder-list", projectId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stakeholder/${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch stakeholder list");
      return res.json();
    },
    enabled: !!projectId,
  });

  const stakeholders = stakeholderData?.data ?? [];

  return (
    <div className="min-h-screen ">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold leading-[110%] text-[#00253E]">Project List</h1>
        <p className="flex items-center gap-2 mt-1">
          <span className="text-lg md:text-xl text-[#00253E] font-medium leading-[120%]">New ERP-System</span>
          <ChevronRight size={24} className="text-[#6B6B6B]" />
          <span className="text-lg md:text-xl text-[#00253E] font-medium leading-[120%]">Stakeholder</span>
        </p>
      </div>

      {/* Stakeholder List */}
      <div className="flex flex-col divide-y divide-gray-100 border-b border-gray-100">
        {isLoading ? (
          <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-[90px] w-full rounded-[8px] bg-[#00253E]/30" />
                    ))}
                  </div>
        ) : stakeholders.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No stakeholders found.</p>
        ) : (
          stakeholders.map((stakeholder) => (
            <div
              key={stakeholder._id}
              className="flex items-center justify-between py-5 border-b border-[#A0A19F]"
            >
              {/* Left — avatar + name */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-[8px] bg-[#BADA55] flex items-center justify-center p-1">
                  <User size={24} className="text-[#00253E]" />
                </div>
                <span className="text-lg md:text-xl lg:text-2xl font-semibold text-[#00253E] leading-[110%]">
                  {stakeholder?.name}
                </span>
              </div>

              {/* Right — Trigger + Measures */}
              <div className="flex items-center gap-8">
                {/* Trigger */}
                <Link
                  href={`/trainer/darrell-steward-project-list/trigger/${stakeholder._id}`}
                >
                  <button className="flex items-center gap-3 text-lg md:text-xl lg:text-2xl font-semibold text-[#00253E] leading-[110%]">
                    Trigger
                    <span className="w-8 h-8 rounded-[8px] bg-[#BADA55] flex items-center justify-center p-1">
                      <AlarmClockPlus size={24} className="text-[#00253E]" />
                    </span>
                  </button>
                </Link>

                {/* Measures */}
               <Link
                  href={{
                    pathname:
                      "/trainer/darrell-steward-project-list/measures",
                    query: {
                      projectId: projectId,
                      stakeholderId: stakeholder._id,
                    },
                  }}
                >
                  <button className="flex items-center gap-3 text-lg md:text-xl lg:text-2xl font-semibold text-[#00253E] leading-[110%]">
                    Measures
                    <span className="w-8 h-8 rounded-[8px] bg-[#BADA55] flex items-center justify-center p-1">
                      <CopyMinus size={24} className="text-[#00253E]" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Go Back */}
      <div className="mt-6">
        <Link
          href={`/trainer/darrell-steward-project-list/${projectId}`}
           className="inline-flex items-center gap-2 text-base text-[#00253E] font-medium underline leading-[110%]"
        >
          <span className="w-8 h-8 rounded-full border border-[#00253E] flex items-center justify-center">
            <ChevronLeft size={32} />
          </span>
          Go Back
        </Link>
      </div>
    </div>
  );
}