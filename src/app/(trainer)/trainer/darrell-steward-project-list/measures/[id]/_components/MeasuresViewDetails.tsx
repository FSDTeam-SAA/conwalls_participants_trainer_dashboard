"use client";

import { useEffect, useState } from "react";
import { Bot, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface MeasureData {
  _id: string;
  stakeholderId: string;
  insightEngineId: string;
  category: string;
  type: string;
  name: string;
  startWeeks: number;
  timing: "pre" | "post";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: MeasureData;
}

export default function MeasuresViewDetails() {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [startWeeks, setStartWeeks] = useState(0);
  const [timing, setTiming] = useState<"pre" | "post">("post");

  const params = useParams();
  const measureId = params?.id as string;

  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken ?? "";

  const { data: singleMeasureData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["single-measure", measureId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/measure/${measureId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch measure details");
      return res.json();
    },
    enabled: !!measureId && !!TOKEN,
  });

  // Populate form fields when data loads
  useEffect(() => {
    if (singleMeasureData?.data) {
      const d = singleMeasureData.data;
      setCategory(d.category);
      setType(d.type);
      setName(d.name);
      setStartWeeks(d.startWeeks);
      setTiming(d.timing);
    }
  }, [singleMeasureData]);

  // const handleAdd = () => {
  //   console.log({ category, type, name, startWeeks, timing });
  // };

  return (
    <div className="min-h-screen font-sans">
      {/* Breadcrumb */}
      <div className="mb-6 pt-4">
        <p className="text-lg md:text-xl lg:text-2xl font-semibold text-[#00253E] leading-normal">Project List</p>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
          <span className="text-lg md:text-xl font-medium text-[#00253E] leading-[120%]">Stakeholder</span>
          <ChevronRight size={20} />
          <span className="text-lg md:text-xl font-medium text-[#00253E] leading-[120%]">Measures</span>
        </p>
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-400">Loading...</div>
      ) : (
        <>
          {/* Form */}
          <div className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#003049] focus:border-transparent transition"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#003049] focus:border-transparent transition"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#003049] focus:border-transparent transition"
              />
            </div>

            {/* Start Weeks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={startWeeks}
                  onChange={(e) => setStartWeeks(Number(e.target.value))}
                  className="w-20 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-[#003049] focus:border-transparent transition"
                />
                <span className="text-sm text-gray-600">Weeks</span>
              </div>
            </div>

            {/* Pre / Post radio + AI button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Pre */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setTiming("pre")}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      timing === "pre" ? "border-[#003049]" : "border-gray-300"
                    }`}
                  >
                    {timing === "pre" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#003049]" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Pre</span>
                </label>

                {/* Post */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setTiming("post")}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      timing === "post"
                        ? "border-[#c5e84a]"
                        : "border-gray-300"
                    }`}
                  >
                    {timing === "post" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#c5e84a]" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Post</span>
                </label>

                <span className="text-sm text-gray-600">kick off</span>
              </div>

              {/* AI Button */}
              {/* <button className="flex items-center gap-2 bg-[#003049] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a4a6b] transition-colors">
                <Bot size={14} />
                AI »
              </button> */}
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex items-center justify-between mt-10 ">
            {/* Back */}
            <Link href="#">
              <button className="flex items-center gap-1.5 border border-gray-300 text-gray-700 text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <ChevronLeft size={13} />
                Back
              </button>
            </Link>

            {/* AI Button */}
              <button className="flex items-center gap-2 bg-[#003049] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a4a6b] transition-colors">
                <Bot size={14} />
                AI »
              </button>

            {/* Add */}
            {/* <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 bg-[#c5e84a] text-[#2d4a00] text-xs font-semibold px-6 py-2.5 rounded-lg hover:bg-[#b8d93e] transition-colors"
            >
              Add
              <ChevronRight size={13} />
            </button> */}
          </div>
        </>
      )}
    </div>
  );
}