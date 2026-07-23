import { AlertTriangle } from "lucide-react";

export const ErrorState = ({ message = "Something went wrong", darkMode = false, onRetry }) => (
  <div className={`flex flex-col items-center justify-center py-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
    <AlertTriangle className="w-10 h-10 mb-3 text-red-400" />
    <p className="text-sm font-medium mb-3">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
        Retry
      </button>
    )}
  </div>
);
