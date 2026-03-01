"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronsRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import penIcon from "../../../../../../public/assets/images/pen.png"
import infoIcon from "../../../../../../public/assets/images/info.png"
import Image from "next/image";

interface ProjectData {
  _id: string;
  projectTitle: string;
  createdBy: string;
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

  // console.log("Fetched Project Details:", project?.createdBy);

  const participantsId = project?.createdBy

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  };

  return (
    <div className="min-h-screen pb-24 font-sans relative">
      {/* Page Header */}
      {/* <div className="mb-1">
        <h1 className="text-xl font-bold text-gray-800">Project List</h1>
        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
          <span className="text-gray-600 font-medium">
            {project?.participantName ?? "—"}
          </span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-600">{project?.projectTitle ?? "—"}</span>
        </p>
      </div> */}

       {/* Page Header */}
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Project List
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Dashboard <span className="text-gray-400">&gt;</span>{" "}
            <span className="text-gray-600 font-medium">
              {project?.participantName ?? "—"}
            </span>
          </p>
        </div>

      {/* Kick Off Date */}
      <div className="flex items-center gap-2 text-lg md:text-xl lg:text-2xl text-[#00253E] font-normal leading-[110%] mt-3 mb-6">
        <CalendarDays  size={24} className="text-gray-500" />
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
              <div className="flex items-center gap-1.5 mb-3">
                <Image src={penIcon} alt="Pen Icon" width={24} height={24} />
                <span className="text-lg md:text-xl font-normal text-[#00253E]">
                  {field.label}
                </span>
                 <Image src={infoIcon} alt="Pen Icon" width={24} height={24} />
              </div>

              {/* Text Box */}
              <div className="w-full !rounded-[8px] border border-[#00253E] px-4 py-3 min-h-[90px] text-[#00253E] font-normal leading-[110%] text-lg md:text-xl">
                {project?.systemForms?.[
                  field.key as keyof typeof project.systemForms
                ] ?? "—"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Buttons */}
     <div className="flex justify-between items-center my-10">
      {/* Go Back */}
        <Link
          href={`/trainer/darrell-steward/${participantsId}`}
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
          <button className="bg-[#BADA55] hover:bg-[#BADA55]/90 text-black text-sm font-semibold px-6 py-2.5 !rounded-[8px] flex items-center gap-1.5 transition-colors">
            Continue
            <ChevronsRight  size={20} />
          </button>
        </Link>
     </div>
    </div>
  );
}