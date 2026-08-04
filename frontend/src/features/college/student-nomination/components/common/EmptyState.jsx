import React from "react";
import { Inbox } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const EmptyState = ({ 
  title = "No Records Found", 
  description = "Try adjusting your search criteria or filters.",
  action = null
}) => {
  const { darkMode = false } = useOutletContext() || {};

  return (
    <div className={`relative overflow-hidden w-full rounded-3xl border p-12 text-center transition-all duration-300 shadow-md
      ${darkMode ? "bg-[#2D2D2D] border-[#3D3D3D] shadow-black/20" : "bg-white border-slate-200 shadow-slate-100/80"}`}
    >
      {/* Top Accent Stripe */}
      <div className={`absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r ${
        darkMode ? "from-[#ff6d34] to-[#cc5829]" : "from-[#ff7a00] to-[#e06b00]"
      }`} />

      <div className="relative flex flex-col items-center justify-center max-w-md mx-auto">
        {/* Icon Container */}
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-5
          ${darkMode ? "bg-[#3D3D3D] text-slate-300" : "bg-slate-50 text-slate-400"}`}
        >
          <Inbox size={26} strokeWidth={2} />
        </div>
        
        {/* Title */}
        <h3 className={`text-xl font-bold tracking-tight mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
          {title}
        </h3>

        {/* Description */}
        <p className={`text-sm font-medium leading-relaxed max-w-xs ${darkMode ? "text-slate-400" : "text-slate-500"} ${action ? "mb-6" : ""}`}>
          {description}
        </p>

        {/* Optional Action Slot */}
        {action && (
          <div className="flex items-center justify-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;