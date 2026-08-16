import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorState = ({ message = "Something went wrong.", onRetry, darkMode = false }) => (
  <div className={`flex items-start gap-3 border border-l-4 px-4 py-3.5 rounded-xl ${
    darkMode
      ? "bg-red-900/20 border-red-800 border-l-red-500 text-red-300"
      : "bg-red-50 border-red-200 border-l-red-500 text-red-700"
  }`}>
    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${darkMode ? "text-red-400" : "text-red-500"}`} />
    <span className="text-sm font-medium flex-1">{message}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        className={`flex items-center gap-1 text-xs font-semibold shrink-0 transition-colors ${
          darkMode ? "text-red-400 hover:text-red-200" : "text-red-600 hover:text-red-800"
        }`}
      >
        <RefreshCw className="w-3 h-3" />
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
