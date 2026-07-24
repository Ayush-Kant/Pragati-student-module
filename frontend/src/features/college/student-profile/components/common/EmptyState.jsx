import React from "react";
import { CircleSlash } from "lucide-react";

export const EmptyState = ({
  title = "No Data Available",
  message = "There are no records to display at this moment.",
  icon: Icon = CircleSlash,
  darkMode
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border shadow-[0_4px_20px_rgba(0,0,0,0.01)] ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]/80' : 'bg-white border-gray-100/80'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border mb-3 ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D] text-gray-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h4>
      <p className="mt-1 text-xs text-gray-400 max-w-xs">{message}</p>
    </div>
  );
};

export default EmptyState;
