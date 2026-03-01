"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, Eye, Users } from "lucide-react";
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
    <div className="min-h-screen bg-white p-4 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-0 mb-6 w-fit rounded-lg overflow-hidden border border-gray-200">
        <div className="flex items-center gap-2 bg-[#003049] text-white text-xs font-semibold px-4 py-2.5">
          New ERP-System
        </div>
        <div className="flex items-center gap-2 bg-[#1a4a6b] text-white text-xs font-semibold px-4 py-2.5">
          <Users size={13} />
          Stakeholder
        </div>
        <div className="flex items-center gap-2 bg-[#c5e84a] text-[#2d4a00] text-xs font-semibold px-4 py-2.5">
          <Clock size={13} />
          Measures
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-4 bg-[#003049] text-white text-sm font-semibold px-5 py-3">
          <span>Subject</span>
          <span>Type</span>
          <span className="text-center">Category</span>
          <span className="text-center">Action</span>
        </div>

        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="px-5 py-6 text-sm text-gray-400">Loading...</div>
          ) : measures.length === 0 ? (
            <div className="px-5 py-6 text-sm text-gray-400">
              No measures found.
            </div>
          ) : (
            measures.map((measure) => (
              <div
                key={measure._id}
                className="grid grid-cols-4 items-center px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-800 font-medium">
                  {measure.name}
                </span>
                <span className="text-sm text-gray-600">{measure.type}</span>
                <span className="text-center">
                  <span
                    className={`inline-block text-xs font-semibold rounded-full px-3 py-1 ${
                      categoryStyles[measure.category] ??
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {measure.category}
                  </span>
                </span>
                <span className="flex justify-center">
                  <Link
                    href={`/trainer/darrell-steward-project-list/measures/${measure._id}`}
                  >
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200">
                      <Eye className="w-4 h-4" />
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
          href={`/trainer/darrell-steward-project-list?projectId=${projectId}`}
        >
          <button className="flex items-center gap-2 bg-[#003049] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#1a4a6b] transition-colors">
            <Users size={13} />
            Stakeholder
          </button>
        </Link>

        <Link
          href={`/trainer/time-table?projectId=${projectId}&stakeholderId=${stakeholderId}`}
        >
          <button className="flex items-center gap-2 border border-[#003049] text-[#003049] bg-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock size={13} />
            Timetable »
          </button>
        </Link>
      </div>
    </div>
  );
}
