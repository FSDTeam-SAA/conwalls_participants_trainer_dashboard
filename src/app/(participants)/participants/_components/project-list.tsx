"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import moment from "moment";
import { ProjectListsApiResponse } from "./project-list-data-type";

const ProjectList = () => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken?: string })?.accessToken;

  console.log("token", token);

  const { data, isLoading, isError, error } = useQuery<ProjectListsApiResponse>(
    {
      queryKey: ["projects"],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/insight-engine`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        return res.json();
      },
    },
  );

  console.log("isLoading", isLoading);
  console.log("isError", isError);
  console.log("error", error);

  console.log("project data", data);

  const projectLists = data?.data?.items || [];

  return (
    <div>
      {/* header part  */}
      <div className="w-full flex items-center justify-between pb-6">
        <h4 className="text-2xl font-semibold leading-normal text-[#00253E]">
          Project List
        </h4>
        <Link href="/participants/add-new-project">
          <button className="h-[56px] flex items-center gap-2 bg-primary font-medium leading-normal text-[#00253E] px-8 py-4 rounded-[8px]">
            <Plus className="h-4 w-4" />
            Add New Project
          </button>
        </Link>
      </div>

      {/* project list part */}

      <div>
        {projectLists?.map((project) => {
          return (
            <div
              key={project?._id}
              className="border border-primary bg-[#00253E] rounded-[8px] shadow-[0_0_10px_0_#0000001A] p-4 mb-4"
            >
              <h4 className="text-xl md:text-2xl text-white font-semibold leading-normal pb-1">
                {project.projectTitle || ""}
              </h4>
              <p className="text-base text-white font-normal leading-normal">
                Created Date : {moment(project.createdAt).format("DD-MM-YYYY")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectList;
