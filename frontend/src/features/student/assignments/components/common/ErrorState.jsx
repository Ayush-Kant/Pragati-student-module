const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
    <span>⚠ {message}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-xs font-semibold underline shrink-0"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
