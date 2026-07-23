import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const ErrorState = ({ message = "An error occurred while handling records.", onRetry }) => {
  const { darkMode } = useOutletContext();

  return (
    <div className={`relative overflow-hidden w-full rounded-3xl border p-12 text-center transition-all duration-300 shadow-md
      ${darkMode ? "bg-[#2D2D2D] border-[#3D3D3D] shadow-black/20" : "bg-white border-slate-200 shadow-slate-100/80"}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r ${darkMode ? "from-[#ff6d34] to-[#cc5829]" : "from-[#ff7a00] to-[#e06b00]"}`} />

      <div className="relative flex flex-col items-center justify-center max-w-md mx-auto">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-5
          ${darkMode ? "bg-[#2D2D2D] text-[#ff6d34]" : "bg-orange-50 text-[#ff7a00]"}`}>
          <AlertCircle size={26} strokeWidth={2.5} />
        </div>
        
        <h3 className={`text-xl font-bold tracking-tight mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Something went wrong
        </h3>
        <p className={`text-sm font-medium leading-relaxed mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          {message}
        </p>
        
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="group flex items-center gap-2 bg-[#ff7a00] hover:bg-[#e06b00] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            <RefreshCw size={15} className="group-hover:rotate-180 transition-transform duration-500 ease-out" />
            Reload Records
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;