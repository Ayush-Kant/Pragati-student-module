import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export const ErrorState = ({
  message = "An error occurred while fetching data.",
  onRetry,
  darkMode
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border ${darkMode ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50/30 border-rose-100/80'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border mb-3 ${darkMode ? 'bg-[#1A1A1A] border-rose-500/30 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Something Went Wrong</h4>
      <p className={`mt-1 text-xs max-w-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-[#ff6d34] hover:bg-[#ff6d34]/90 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorState;
