// ErrorState.jsx
// Shown when a fetch fails; offers a retry action

const ErrorState = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-red-100 rounded-xl bg-red-50">
      <span className="text-4xl mb-3">⚠️</span>
      <h3 className="text-base font-semibold text-red-700">Failed to load</h3>
      <p className="text-sm text-red-500 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
