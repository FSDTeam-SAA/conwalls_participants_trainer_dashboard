"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function MeasuresDetails() {
  const [timing, setTiming] = useState<"Pre" | "Post">("Post");
  const [weeks, setWeeks] = useState(5);

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Project List</h1>
        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
          <span className="text-gray-600">Stakeholder</span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-600">Measures</span>
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Category */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Category</p>
          <div className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700">
            Communication
          </div>
        </div>

        {/* Type */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Type</p>
          <div className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700">
            Newsletter
          </div>
        </div>

        {/* Name */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Name</p>
          <div className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700">
            Kick Off Story
          </div>
        </div>

        {/* Start Weeks */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Start</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="w-20 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 text-center focus:outline-none focus:border-[#6abf4b]"
            />
            <span className="text-sm text-gray-600">Weeks</span>
          </div>
        </div>

        {/* Pre / Post + AI Button */}
        <div className="flex items-center justify-between">
          {/* Pre / Post toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              {/* Pre */}
              <button
                type="button"
                onClick={() => setTiming("Pre")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    timing === "Pre"
                      ? "border-[#6abf4b]"
                      : "border-gray-300"
                  }`}
                >
                  {timing === "Pre" && (
                    <span className="w-2 h-2 rounded-full bg-[#6abf4b]" />
                  )}
                </span>
                <span className={timing === "Pre" ? "text-gray-800" : "text-gray-500"}>
                  Pre
                </span>
              </button>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-200" />

              {/* Post */}
              <button
                type="button"
                onClick={() => setTiming("Post")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    timing === "Post"
                      ? "border-[#6abf4b]"
                      : "border-gray-300"
                  }`}
                >
                  {timing === "Post" && (
                    <span className="w-2 h-2 rounded-full bg-[#6abf4b]" />
                  )}
                </span>
                <span className={timing === "Post" ? "text-gray-800" : "text-gray-500"}>
                  Post
                </span>
              </button>
            </div>
            <span className="text-sm text-gray-500">kick off</span>
          </div>

          {/* AI Button */}
          <button className="flex items-center gap-2 bg-[#003049] hover:bg-[#002538] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
            <span className="text-base">🖨️</span>
            AI
            <ChevronRight size={13} />
            <ChevronRight size={13} className="-ml-2.5" />
          </button>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between mt-8">
        {/* Back */}
        <Link href="#">
          <button className="flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            <ChevronLeft size={14} />
            Back
          </button>
        </Link>

        {/* Add */}
        <Link href="#">
          <button className="flex items-center gap-1.5 bg-[#c5e84a] hover:bg-[#b5d83a] text-[#2d4a00] text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
            Add
            <ChevronRight size={14} />
            <ChevronRight size={14} className="-ml-2.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}