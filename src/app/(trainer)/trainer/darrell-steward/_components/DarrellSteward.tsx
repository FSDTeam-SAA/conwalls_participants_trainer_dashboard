"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const projects = [
  { id: 1, name: "New ERP-System", createdDate: "08 - 02 - 2026" },
  { id: 2, name: "CRM Integration", createdDate: "09 - 02 - 2026" },
  { id: 3, name: "Mobile App Redesign", createdDate: "12 - 02 - 2026" },
  { id: 4, name: "Data Analytics Dashboard", createdDate: "15 - 02 - 2026" },
];

export default function DarrellSteward() {
  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      {/* Back Button */}
      <div className="mb-4">
        <Link
          href="/participants"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
            <ChevronLeft size={13} />
          </span>
          Go Back to Participants Management
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Project List</h1>
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
          Dashboard
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-700 font-medium">Darrell Steward</span>
        </p>
      </div>

      {/* Project Cards */}
      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-full rounded-xl px-6 py-4 bg-[#003049] text-white"
          >
            <p className="text-base font-semibold">{project.name}</p>
            <p className="text-xs text-gray-300 mt-1">
              Created Date : {project.createdDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}