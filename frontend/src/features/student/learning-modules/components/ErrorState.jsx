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
      <div className="bg-orange-500/10 rounded-full p-4 mb-4">
        <AlertTriangle className="w-10 h-10 text-orange-500/50" />
      </div>
      <h3 className="text-xl font-semibold text-gray-100 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-400 max-w-md mb-6">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
