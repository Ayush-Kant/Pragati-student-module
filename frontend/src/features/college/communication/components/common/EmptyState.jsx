import React from "react";
import { Inbox } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const EmptyState = ({
  title = "No Announcements Found",
  description = "Try adjusting your search criteria or filters.",
}) => {
  const context = useOutletContext();
  const darkMode = context?.darkMode ?? false;

  return (
    <div
      className={`relative overflow-hidden w-full rounded-3xl border p-12 text-center transition-all duration-300 shadow-md ${
        darkMode
          ? "bg-[#151D30] border-slate-700/60 shadow-black/20"
          : "bg-white border-slate-200 shadow-slate-100/80"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-blue-600 to-indigo-600" />

      <div className="relative flex flex-col items-center justify-center max-w-md mx-auto">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-5 ${
            darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"
          }`}
        >
          <Inbox size={26} strokeWidth={2} />
        </div>

        <h3
          className={`text-xl font-bold tracking-tight mb-2 ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm font-medium leading-relaxed max-w-xs ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
