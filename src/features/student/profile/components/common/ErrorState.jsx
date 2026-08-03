/**
 * A reusable error state component that displays an error message with an optional retry button.
 * @param {Object} props - The component props
 * @param {string} props.error - The error message to display
 * @param {Function} [props.onRetry] - Optional callback function for the retry button
 * @returns {JSX.Element} The error state component
 */
const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-4xl text-red-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-400">
        Something went wrong
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;