import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export const ErrorState = ({
  title = "Something went wrong",
  message = "An error occurred while loading data. Please try again.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900 shadow-sm my-4">
      <div className="p-3 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-full mb-3">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-rose-950 dark:text-rose-200 mb-1">{title}</h3>
      <p className="text-sm text-rose-600 dark:text-rose-300 max-w-md mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
