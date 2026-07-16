import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div className="flex items-start gap-3 bg-red-50 border border-red-200 border-l-4 border-l-red-500 text-red-700 px-4 py-3.5 rounded-xl">
    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
    <span className="text-sm font-medium flex-1">{message}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 shrink-0 transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
