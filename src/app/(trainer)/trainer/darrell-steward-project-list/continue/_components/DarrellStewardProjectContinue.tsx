"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, User, Plus } from "lucide-react";
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
    <div className="min-h-screen bg-white p-6 font-sans">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">Project List</h1>
        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
          <span className="text-gray-600">New ERP-System</span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-600">Stakeholder</span>
        </p>
      </div>

      {/* Stakeholder List */}
      <div className="flex flex-col divide-y divide-gray-100 border-b border-gray-100">
        {isLoading ? (
          <p className="text-sm text-gray-400 py-4">Loading...</p>
        ) : stakeholders.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No stakeholders found.</p>
        ) : (
          stakeholders.map((stakeholder) => (
            <div
              key={stakeholder._id}
              className="flex items-center justify-between py-4"
            >
              {/* Left — avatar + name */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#e8f5e0] flex items-center justify-center">
                  <User size={16} className="text-[#6abf4b]" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {stakeholder.name}
                </span>
              </div>

              {/* Right — Trigger + Measures */}
              <div className="flex items-center gap-3">
                {/* Trigger */}
                <Link
                  href={`/trainer/darrell-steward-project-list/trigger/${stakeholder._id}`}
                >
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors">
                    Trigger
                    <span className="w-5 h-5 rounded-md bg-[#c5e84a] flex items-center justify-center">
                      <Plus size={12} className="text-[#3a5a00]" />
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
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors">
                    Measures
                    <span className="w-5 h-5 rounded-md bg-[#c5e84a] flex items-center justify-center">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3a5a00"
                        strokeWidth="2.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4l3 3" />
                      </svg>
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
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
            <ChevronLeft size={13} />
          </span>
          Go Back
        </Link>
      </div>
    </div>
  );
}