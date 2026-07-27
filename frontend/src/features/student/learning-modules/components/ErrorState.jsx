import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * Error state component with error message and retry action.
 *
 * @param {object} props
 * @param {string} props.error - Error message to display.
 * @param {function} props.onRetry - Callback when retry is clicked.
 * @returns {JSX.Element}
 */
const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-slate-500 max-w-md mb-6">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
