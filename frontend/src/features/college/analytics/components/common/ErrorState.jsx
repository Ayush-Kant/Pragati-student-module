import { AlertTriangle } from "lucide-react";
import { subtleText } from "../../utils/analyticsHelpers";

export const ErrorState = ({ message = "Something went wrong", darkMode = false, onRetry }) => (
  <div className={`flex flex-col items-center justify-center py-10 ${subtleText(darkMode)}`}>
    <AlertTriangle className="w-10 h-10 mb-3 text-red-400" />
    <p className="text-sm font-medium mb-3">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#00bea3] text-white hover:bg-[#009e88] transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);
