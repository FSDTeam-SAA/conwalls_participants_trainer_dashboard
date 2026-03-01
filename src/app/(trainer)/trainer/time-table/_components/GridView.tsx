import { Download, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryStyles, type Stakeholder } from "./TimeTable";

interface GridViewProps {
  stakeholders: Stakeholder[];
  kickOffDate?: string;
}

const TOTAL_WEEKS = 16;

export default function GridView({ stakeholders }: GridViewProps) {
  return (
    <div className="space-y-8">
      {stakeholders?.map((stakeholder) => (
        <div key={stakeholder._id}>
          {/* Group Header */}
          <div className="flex items-center justify-between mb-8">
            <button className="flex items-center gap-3 bg-transparent text-[#00253E] text-lg md:text-xl lg:text-[22px] font-semibold px-4 py-2 rounded-[8px] border-y border-x-[4px] border-[#BADA55]">
              <User size={24} className="bg-[#BADA55] p-1 rounded-[8px]" />
              {stakeholder.name}
            </button>
            <Button
                variant="ghost"
                size="sm"
                className="h-[46px] flex items-center gap-1.5 border border-[#BADA55] text-[#00253E] text-base font-medium px-5 py-1.5 rounded-[8px] hover:bg-gray-50"
              >
                <Download size={12} />
                Export PDF
              </Button>
          </div>

          {/* Gantt Chart */}
          <div className="border border-gray-100 rounded-xl overflow-hidden bg-[#f7f9fb] p-4 ">
            {/* Week ruler */}
            <div
              className="grid mb-4"
              style={{ gridTemplateColumns: `repeat(${TOTAL_WEEKS}, 1fr)` }}
            >
              {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
                <div
                  key={i}
                  className="text-center text-[9px] text-gray-400 border-l border-gray-200 py-0.5"
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Measure rows */}
            <div className="space-y-4">
              {stakeholder.measures.length === 0 ? (
                <div className="text-xs text-gray-400 py-2">No measures found.</div>
              ) : (
                stakeholder.measures.map((measure) => {
                  const style = categoryStyles[measure.category];
                  const leftPct = ((measure.startWeeks - 1) / TOTAL_WEEKS) * 100;
                  const duration = 3; // default visual duration in weeks
                  const widthPct = (duration / TOTAL_WEEKS) * 100;

                  return (
                    <div key={measure._id} className="relative h-10">
                      {/* Grid lines */}
                      <div
                        className="absolute inset-0 grid"
                        style={{
                          gridTemplateColumns: `repeat(${TOTAL_WEEKS}, 1fr)`,
                        }}
                      >
                        {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
                          <div key={i} className="border-l border-gray-200 h-full" />
                        ))}
                      </div>

                      {/* Label above bar */}
                      <div
                        className="absolute -top-4 text-[9px] text-gray-500 whitespace-nowrap font-medium"
                        style={{ left: `${leftPct}%` }}
                      >
                        {measure.name}
                      </div>

                      {/* Dot marker */}
                      <div
                        className={`absolute top-2.5 w-3 h-3 rounded-sm ${style?.dot ?? "bg-gray-400"} border-2 border-white shadow-sm z-10`}
                        style={{ left: `calc(${leftPct}% - 6px)` }}
                      />

                      {/* Bar */}
                      <div
                        className={`absolute top-1.5 h-7 rounded ${style?.bar ?? "bg-gray-300"} flex items-center px-2`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%`, minWidth: "40px" }}
                      >
                        <span className="text-[10px] font-semibold text-gray-700 truncate">
                          {measure.type}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Change Ambassador row */}
              {stakeholder.measures.length > 0 && (
                <div className="relative h-10 mt-2">
                  <div
                    className="absolute inset-0 grid"
                    style={{ gridTemplateColumns: `repeat(${TOTAL_WEEKS}, 1fr)` }}
                  >
                    {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
                      <div key={i} className="border-l border-gray-200 h-full" />
                    ))}
                  </div>
                  <div
                    className="absolute -top-4 text-[9px] text-gray-500 whitespace-nowrap"
                    style={{ left: "20%" }}
                  >
                    {stakeholder.name}
                  </div>
                  <div
                    className="absolute top-1.5 h-7 rounded bg-[#003049]/20 flex items-center px-2"
                    style={{ left: "20%", width: "20%" }}
                  >
                    <span className="text-[10px] font-semibold text-[#003049] truncate">
                      Change Ambassador
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}