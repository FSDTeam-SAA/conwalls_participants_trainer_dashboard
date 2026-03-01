"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Captions, ChevronsRight, Clock, CopyMinus, Eye, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Measure {
  _id: string;
  stakeholderId: string;
  insightEngineId: string;
  category: string;
  type: string;
  name: string;
  startWeeks: number;
  timing: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: Measure[];
}

const categoryStyles: Record<string, string> = {
  Communication: "bg-[#c5e84a] text-[#2d4a00]",
  Involvement: "bg-[#003049] text-white",
  Recognition: "bg-[#e8f5e0] text-[#3a7d1e]",
};

export default function MeasuresPage() {
  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId") as string;
  const stakeholderId = searchParams.get("stakeholderId") as string;

  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken ?? "";

  const { data: measuresData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["measures", projectId, stakeholderId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/measure/${projectId}/stakeholders/${stakeholderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch measures");
      return res.json();
    },
    enabled: !!projectId && !!stakeholderId,
  });

  const measures = measuresData?.data ?? [];

  return (
    <div className="min-h-screen ">
      {/* Breadcrumb */}
      <div className="flex items-center gap-0 mb-6 w-fit rounded-lg overflow-hidden border border-gray-200">
        <div className="flex items-center gap-2 bg-[#00253E] text-white text-xl md:text-[22px] leading-[110%] font-semibold px-4 py-2">
         <Captions size={24} className=""/> New ERP-System
        </div>
        <div className="flex items-center gap-2 bg-[#437597] text-white text-xl md:text-[22px] leading-[110%] font-semibold px-4 py-2">
          <Users  size={24} />
          Stakeholder
        </div>
        <div className="flex items-center gap-2 bg-[#BADA55] text-[#00253E] text-xl md:text-[22px] leading-[110%] font-semibold px-4 py-2">
          <CopyMinus size={24} />
          Measures
        </div>
      </div>

      {/* Table */}
      <div className=" overflow-hidden border border-gray-100">
        <div className="grid grid-cols-4 bg-[#003049]  px-5 py-3 ">
          <span className="text-white text-lg md:text-xl leading-[110%] font-semibold">Subject</span>
          <span className="text-white text-lg md:text-xl leading-[110%] font-semibold text-center">Type</span>
          <span className="text-white text-lg md:text-xl leading-[110%] font-semibold text-center">Category</span>
          <span className="text-white text-lg md:text-xl leading-[110%] font-semibold text-center">Action</span>
        </div>

        <div className="divide-y divide-gray-100 ">
          {isLoading ? (
            <div className="space-y-4 mt-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-[90px] w-full rounded-[8px] bg-[#00253E]/30" />
                    ))}
                  </div>
          ) : measures.length === 0 ? (
            <div className="px-5 py-6 text-sm text-gray-400">
              No measures found.
            </div>
          ) : (
            measures.map((measure) => (
              <div
                key={measure._id}
                className="grid grid-cols-4 items-center px-5 py-5 border-b border-[#C2C2C2]"
              >
                <span className="text-lg md:text-xl text-[#00253E] font-semibold leading-[110%]">
                  {measure.name}
                </span>
                <span className="text-lg md:text-xl text-[#00253E] font-semibold leading-[110%] text-center">{measure.type}</span>
                <span className="text-center">
                  <span
                    className={`inline-block text-lg md:text-xl leading-[110%] font-semibold rounded-full px-3 py-1 ${
                      categoryStyles[measure.category] ??
                      "bg-[#00253E] text-white"
                    }`}
                  >
                    {measure.category}
                  </span>
                </span>
                <span className="flex justify-center">
                  <Link
                    href={`/trainer/darrell-steward-project-list/measures/${measure._id}`}
                  >
                    <button className="w-8 h-8 bg-[#F6F6F6] rounded-[8px] flex items-center justify-center p-1 ">
                      <Eye className="w-6 h-6 text-[#BADA55]" />
                    </button>
                  </Link>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Bottom Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Link
          href={`/trainer/darrell-steward-project-list/continue/${projectId}`}
        >
          <button className="h-[48px] flex items-center gap-2 bg-[#437597] text-white text-base font-medium leading-[110%] px-5 py-2.5 rounded-[8px] ">
            <Users size={24} />
            Stakeholder
          </button>
        </Link>

        <Link
          href={`/trainer/time-table?projectId=${projectId}&stakeholderId=${stakeholderId}`}
        >
          <button className="h-[48px] flex items-center gap-2 text-[#003049] bg-[#BADA55] text-base font-medium leading-[110%] px-5 py-2.5 rounded-[8px]">
            <Clock size={24} />
            Timetable <ChevronsRight size={24} />
          </button>
        </Link>
      </div>
    </div>
  );
}
