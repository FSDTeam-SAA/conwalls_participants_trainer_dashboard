"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Stakeholder {
  _id: string;
  name: string;
  roleType: string;
  painPoint: string;
  benefits: string;
  triggerEvaluation: string;
  objectionsConcerns: string;
  objectionHandling: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: Stakeholder;
}

export default function TriggerPage() {
  const params = useParams();
  const stakeholderId = params?.id as string;

  const session = useSession();
  const TOKEN = session.data?.user?.accessToken;

  const { data: triggerData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["trigger-details", stakeholderId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stakeholder/single/${stakeholderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch trigger details");
      return res.json();
    },
    enabled: !!stakeholderId,
  });

  const stakeholder = triggerData?.data;

  const formatTriggerEvaluation = (value: string) => {
    return value
      ?.replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-white p-6 pb-24 font-sans">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">Project List</h1>
        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
          <span className="text-gray-600">Stakeholder</span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-600">Trigger</span>
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Role */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Role</p>
            <div className="inline-block border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 min-w-[160px]">
              {stakeholder?.roleType ?? "—"}
            </div>
          </div>

          {/* Pain Point */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-base">🖊️</span>
              <span className="text-sm font-semibold text-gray-700">Pain point</span>
              <Info size={14} className="text-gray-400" />
            </div>
            <div className="w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[90px] text-sm text-gray-700 leading-relaxed">
              {stakeholder?.painPoint ?? "—"}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-base">🖊️</span>
              <span className="text-sm font-semibold text-gray-700">Benefits</span>
              <Info size={14} className="text-gray-400" />
            </div>
            <div className="w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[90px] text-sm text-gray-700 leading-relaxed">
              {stakeholder?.benefits ?? "—"}
            </div>
          </div>

          {/* Trigger Evaluations */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Trigger Evaluations</p>
            <div className="inline-block border border-gray-300 rounded-lg px-4 py-1.5 text-sm text-gray-700">
              {formatTriggerEvaluation(stakeholder?.triggerEvaluation ?? "")}
            </div>
          </div>

          {/* Objections / Concerns */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-base">🖊️</span>
              <span className="text-sm font-semibold text-gray-700">Objections / Concerns</span>
              <Info size={14} className="text-gray-400" />
            </div>
            <div className="w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[90px] text-sm text-gray-700 leading-relaxed">
              {stakeholder?.objectionsConcerns ?? "—"}
            </div>
          </div>

          {/* Objection Handling */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-base">🖊️</span>
              <span className="text-sm font-semibold text-gray-700">Objection Handling</span>
              <Info size={14} className="text-gray-400" />
            </div>
            <div className="w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[90px] text-sm text-gray-700 leading-relaxed">
              {stakeholder?.objectionHandling ?? "—"}
            </div>
          </div>
        </div>
      )}

      {/* Go Back */}
      <div className="mt-8">
        <Link
          href="#"
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