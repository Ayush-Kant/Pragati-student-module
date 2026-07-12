import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export const ErrorState = ({ 
  message = "Failed to load reports data. Please verify your connection and try again.", 
  onRetry 
}) => {
  return (
    <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 max-w-2xl mx-auto my-6 shadow-sm">
      <div className="flex-shrink-0 p-2 bg-red-100 text-red-600 rounded-xl">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="flex-grow text-center sm:text-left">
        <h4 className="text-base font-semibold text-red-900 mb-1">System Error Encountered</h4>
        <p className="text-sm text-red-700 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-white hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition duration-150 active:scale-97 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Load</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
