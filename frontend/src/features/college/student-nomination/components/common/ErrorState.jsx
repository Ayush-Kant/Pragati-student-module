import { useOutletContext } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

const ErrorState = ({
  icon: Icon = TriangleAlert,
  title = "Something went wrong",
  description = "We couldn't load the requested data. Please try again.",
  actionLabel = "Try Again",
  onAction,
  className = "",
}) => {
  const { darkMode } = useOutletContext();

  return (
    <div
      className={`flex min-h-[320px] flex-col items-center justify-center px-8 text-center ${className}`}
    >
      {/* Icon */}

      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full border transition-all duration-300 ${
          darkMode
            ? "border-red-900/50 bg-red-950/30"
            : "border-red-200 bg-red-50"
        }`}
      >
        <Icon
          size={38}
          strokeWidth={2}
          className={
            darkMode ? "text-red-400" : "text-red-500"
          }
        />
      </div>

      {/* Title */}

      <h2
        className={`mt-7 text-2xl font-bold ${
          darkMode ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>

      {/* Description */}

      <p
        className={`mt-3 max-w-md text-sm leading-7 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {description}
      </p>

      {/* Retry Button */}

      {onAction && (
        <button
          onClick={onAction}
          className="mt-8 rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorState;