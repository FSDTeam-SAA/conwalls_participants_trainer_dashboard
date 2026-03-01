"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Project {
  _id: string;
  projectTitle: string;
  kickOffDate: string;
  participantName: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    items: Project[];
    paginationInfo: {
      currentPage: number;
      totalPages: number;
      totalData: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export default function DarrellSteward() {
  const params = useParams();
  const participantId = params?.id as string;

  const { data: projectData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["participant-projects", participantId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trainer/participant-insights/${participantId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${TOKEN}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    enabled: !!participantId,
  });

  const projects = projectData?.data?.items ?? [];

  console.log("Fetched Projects:", projects);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  };

  return (
    <div className="min-h-screen p-1 font-sans">
      {/* Back Button */}
      <div className="mb-3">
        <Link
          href="/trainer/participants"
          className="inline-flex items-center gap-1.5 text-sm md:text-base text-[#00253E] leading-[110%]  underline"
        >
          <span className="w-7 h-7 rounded-full border border-[#00253E] flex items-center justify-center">
            <ChevronLeft size={28} />
          </span>
          Go Back to Participants Management
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#00253E] leading-normal">
            Project List
          </h1>
          <p className="flex items-center gap-2 text-lg md:text-xl text-[#00253E] font-medium leading-[120%] mt-1">
            Dashboard <ChevronRight className="text-[#6B6B6B]"/>
            <span className="text-lg md:text-xl text-[#00253E] font-medium leading-[120%]">
              Darrell Steward
            </span>
          </p>
        </div>

      {/* Project Cards */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[90px] w-full rounded-[8px] bg-[#00253E]/30" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-base text-gray-400 pt-10 text-center">No projects found.</p>
        ) : (
          projects?.map((project) => (
            <Link  key={project._id} href={`/trainer/darrell-steward-project-list/${project._id}`}>
              <div
               
                className="w-full rounded-xl px-6 py-4 bg-[#003049] text-white border border-[#BADA55]"
              >
                <p className="text-[24px] font-bold">
                  {project.projectTitle}
                </p>
                <p className="text-base text-[#FFFFFF] mt-1">
                  Created Date : {formatDate(project.kickOffDate)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
