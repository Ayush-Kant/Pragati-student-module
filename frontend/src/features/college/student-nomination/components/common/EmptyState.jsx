import { useOutletContext } from "react-router-dom";
import { SearchX } from "lucide-react";

const EmptyState = ({
  icon: Icon = SearchX,
  title = "No Data Found",
  description = "There is nothing to display right now.",
  actionLabel,
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
            ? "border-slate-700 bg-slate-800"
            : "border-slate-300 bg-slate-100"
        }`}
      >
        <Icon
          size={38}
          strokeWidth={2}
          className={
            darkMode ? "text-slate-400" : "text-slate-500"
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

      {/* Action */}

      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;