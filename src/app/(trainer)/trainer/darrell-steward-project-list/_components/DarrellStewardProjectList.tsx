"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Calendar, Info } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ProjectData {
  _id: string;
  projectTitle: string;
  participantName: string;
  kickOffDate: string;
  systemForms: {
    vision: string;
    pastGoodOldDays: string;
    obstacleProblem: string;
    riskOfInaction: string;
    solutionIdea: string;
  };
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: ProjectData;
}

const fields = [
  { label: "Vision", key: "vision" },
  { label: "The past (good old days)", key: "pastGoodOldDays" },
  { label: "Obstacle / Problem", key: "obstacleProblem" },
  { label: "Risk of inaction / Consequences", key: "riskOfInaction" },
  { label: "Solution / Idea", key: "solutionIdea" },
];

export default function DarrellStewardProjectList() {
  const params = useParams();
  const projectId = params?.id as string;

  const { data: projectData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["project-details", projectId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/insight-engine/${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch project details");
      return res.json();
    },
    enabled: !!projectId,
  });

  const project = projectData?.data;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  };

  return (
    <div className="min-h-screen bg-white p-6 pb-24 font-sans relative">
      {/* Page Header */}
      <div className="mb-1">
        <h1 className="text-xl font-bold text-gray-800">Project List</h1>
        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
          <span className="text-gray-600 font-medium">
            {project?.participantName ?? "—"}
          </span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-600">{project?.projectTitle ?? "—"}</span>
        </p>
      </div>

      {/* Kick Off Date */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-3 mb-6">
        <Calendar size={15} className="text-gray-500" />
        <span>
          Kick off :{" "}
          {project?.kickOffDate ? formatDate(project.kickOffDate) : "—"}
        </span>
      </div>

      {/* Form Fields */}
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="flex flex-col gap-5">
          {fields.map((field) => (
            <div key={field.key}>
              {/* Label */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-base">🖊️</span>
                <span className="text-sm font-semibold text-gray-700">
                  {field.label}
                </span>
                <Info size={14} className="text-gray-400" />
              </div>

              {/* Text Box */}
              <div className="w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[90px] text-sm text-gray-700 leading-relaxed">
                {project?.systemForms?.[
                  field.key as keyof typeof project.systemForms
                ] ?? "—"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
        {/* Go Back */}
        <Link
          href="#"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
            <ChevronLeft size={13} />
          </span>
          Go Back
        </Link>

        {/* Continue */}
        <Link
          href={`/trainer/darrell-steward-project-list/continue/${projectId}`}
        >
          <button className="bg-[#6abf4b] hover:bg-[#59a83c] text-white text-sm font-semibold px-6 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors">
            Continue
            <ChevronRight size={15} />
          </button>
        </Link>
      </div>
    </div>
  );
}