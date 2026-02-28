import { Clock, Download, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryStyles, type Stakeholder } from "./TimeTable";

interface ListViewProps {
  stakeholders: Stakeholder[];
}

export default function ListView({ stakeholders }: ListViewProps) {
  return (
    <div className="space-y-6">
      {stakeholders.map((stakeholder) => (
        <div key={stakeholder._id}>
          {/* Group header row */}
          <div className="flex items-center justify-between mb-2">
            <button className="flex items-center gap-2 bg-[#dce8f0] text-[#003049] text-xs font-semibold px-4 py-2 rounded-lg">
              <User size={13} />
              {stakeholder.name}
            </button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 border border-gray-200 text-gray-500 text-xs font-medium px-3 py-1.5 h-auto rounded-lg hover:bg-gray-50"
              >
                <Download size={12} />
                Export PDF
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-1.5 bg-[#c5e84a] text-[#2d4a00] text-xs font-semibold px-3 py-1.5 h-auto rounded-lg hover:bg-[#b8d93e]"
              >
                <Clock size={12} />
                Timetable
              </Button>
            </div>
          </div>

          {/* Measures table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {stakeholder.measures.length === 0 ? (
              <div className="px-5 py-4 text-xs text-gray-400 bg-white">
                No measures found.
              </div>
            ) : (
              stakeholder.measures.map((measure, idx) => (
                <div
                  key={measure._id}
                  className={`flex items-stretch ${
                    idx !== stakeholder.measures.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  {/* Week cell */}
                  <div className="w-20 shrink-0 bg-gray-50 border-r border-gray-200 flex items-center px-3 py-4">
                    <span className="text-xs text-gray-500">
                      Week {measure.startWeeks}
                    </span>
                  </div>

                  {/* Content cell */}
                  <div className="flex-1 bg-white px-5 py-3">
                    <p className="text-sm text-gray-800 font-medium">
                      {measure.name}
                    </p>
                    <span
                      className={`inline-block mt-1.5 text-[11px] font-semibold rounded-full px-3 py-0.5 ${
                        categoryStyles[measure.category]?.badge ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {measure.category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Change Ambassador */}
          <p className="text-xs text-gray-600 mt-3">
            Change Ambassador :{" "}
            <span className="text-[#5a8a30] font-medium italic">
              {stakeholder.name}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}