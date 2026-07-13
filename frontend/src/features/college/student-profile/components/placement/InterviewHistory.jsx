import React from "react";
import { MessageSquare, Calendar, HelpCircle } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/studentProfileHelpers";

export const InterviewHistory = ({ placements = [] }) => {
  // Extract all interview rounds across companies
  const roundsList = placements.flatMap((comp) => {
    if (!comp.rounds) return [];
    return comp.rounds.map((r) => ({
      ...r,
      companyName: comp.company,
      jobRole: comp.role
    }));
  });

  // Sort by date descending
  const sortedRounds = roundsList.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">Interview Log</h3>
        <p className="text-xs text-gray-400">Detailed records of interview rounds and feedback</p>
      </div>

      <div className="space-y-4">
        {sortedRounds.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400">No interview logs registered.</div>
        ) : (
          sortedRounds.map((round, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-100/60 bg-slate-50/20 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">{round.companyName}</span>
                  <span className="text-[10px] text-gray-400 font-semibold">• {round.jobRole}</span>
                </div>

                <div className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                  {round.roundName}
                </div>

                <p className="text-[11px] text-gray-500 leading-normal italic flex items-start gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  "{round.feedback || "Pending feedback"}"
                </p>
              </div>

              <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 mt-1 sm:mt-0 flex-shrink-0">
                <div className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(round.date)}
                </div>
                <StatusBadge status={round.status} type="interview" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
