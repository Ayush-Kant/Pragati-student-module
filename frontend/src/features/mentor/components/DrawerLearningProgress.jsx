import React from "react";
import { CheckCircle2, PlayCircle, Circle } from "lucide-react";

export default function DrawerLearningProgress({ overallProgress = 0, topics = [] }) {
  const getTopicStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return (
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
            COMPLETED
          </span>
        );
      case "IN PROGRESS":
      case "IN_PROGRESS":
        return (
          <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100 animate-pulse">
            IN PROGRESS
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200">
            PENDING
          </span>
        );
    }
  };

  const getTopicIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return <CheckCircle2 className="h-5.5 w-5.5 text-emerald-500 shrink-0" />;
      case "IN PROGRESS":
      case "IN_PROGRESS":
        return <PlayCircle className="h-5.5 w-5.5 text-[#004ac6] shrink-0" />;
      case "PENDING":
      default:
        return <Circle className="h-5.5 w-5.5 text-slate-300 shrink-0" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <h4 className="text-sm font-bold text-slate-800">Learning Progress</h4>
        <span className="text-sm font-bold text-[#004ac6]">{overallProgress}% Overall</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full rounded-full bg-blue-50 mb-6">
        <div
          className="h-2 rounded-full bg-[#004ac6] transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* Topics list */}
      <div className="flex flex-col gap-4">
        {topics.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getTopicIcon(item.status)}
              <span className="text-sm font-bold text-slate-700">
                {item.topic}
              </span>
            </div>
            {getTopicStatusBadge(item.status)}
          </div>
        ))}
      </div>
    </div>
  );
}
