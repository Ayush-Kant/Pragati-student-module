import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export const ErrorState = ({
  message = "An error occurred while fetching data.",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/30 rounded-2xl border border-rose-100/80">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100 text-rose-500 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-gray-800">Something Went Wrong</h4>
      <p className="mt-1 text-xs text-gray-500 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-sm shadow-indigo-100"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorState;
