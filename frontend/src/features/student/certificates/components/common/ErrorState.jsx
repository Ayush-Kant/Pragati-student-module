import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

/**
 * Reusable error-state component.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.message
 * @param {Function} props.onRetry
 * @param {string} props.retryLabel
 * @param {string} props.className
 * @returns {JSX.Element}
 */
const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load this information. Please try again.",
  onRetry,
  retryLabel = "Try again",
  className = "",
}) => {
  return (
    <div
      className={`w-full rounded-2xl border border-red-100 bg-red-50/60 px-5 py-8 sm:px-7 sm:py-10 md:px-8 ${className}`}
      role="alert"
    >
      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 sm:h-12 sm:w-12">
          <AlertCircle
            className="h-5 w-5 sm:h-6 sm:w-6"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <div className="mt-4 md:ml-4 md:mt-0 md:flex-1">
          <h3 className="text-sm font-bold text-red-900 sm:text-base">
            {title}
          </h3>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-red-700 sm:text-sm sm:leading-6">
            {message}
          </p>

          {typeof onRetry === "function" ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-700 shadow-sm transition-colors duration-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 sm:text-sm"
            >
              <RefreshCw
                className="h-4 w-4"
                aria-hidden="true"
              />

              <span>{retryLabel}</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;