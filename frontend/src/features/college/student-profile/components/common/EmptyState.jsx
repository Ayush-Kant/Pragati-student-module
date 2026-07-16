import React from "react";
import { CircleSlash } from "lucide-react";

export const EmptyState = ({
  title = "No Data Available",
  message = "There are no records to display at this moment.",
  icon: Icon = CircleSlash
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-3 text-slate-400">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
      <p className="mt-1 text-xs text-gray-400 max-w-xs">{message}</p>
    </div>
  );
};

export default EmptyState;
