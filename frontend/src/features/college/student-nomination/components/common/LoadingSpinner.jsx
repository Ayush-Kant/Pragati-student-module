import { useOutletContext } from "react-router-dom";

const sizeClasses = {
  sm: "h-10 w-10 border-[3px]",
  md: "h-14 w-14 border-4",
  lg: "h-20 w-20 border-[5px]",
};

const LoadingSpinner = ({
  size = "md",
  text = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  const { darkMode } = useOutletContext();

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "min-h-[60vh]" : "min-h-[260px]"
      } ${className}`}
    >
      <div className="relative">
        {/* Background Ring */}

        <div
          className={`${sizeClasses[size]} rounded-full ${
            darkMode ? "border-slate-700" : "border-slate-200"
          }`}
        />

        {/* Spinner */}

        <div
          className={`absolute inset-0 ${sizeClasses[size]} animate-spin rounded-full border-transparent ${
            darkMode
              ? "border-t-blue-400 border-r-blue-500"
              : "border-t-blue-600 border-r-blue-500"
          }`}
        />
      </div>

      {text && (
        <div className="mt-6 flex flex-col items-center gap-1">
          <p
            className={`text-sm font-semibold ${
              darkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {text}
          </p>

          <p
            className={`text-xs ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Please wait a moment...
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;