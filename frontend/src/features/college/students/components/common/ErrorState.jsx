const ErrorState = ({ message = "Something went wrong", onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <span className="text-6xl">⚠️</span>
    <h3 className="text-lg font-semibold text-gray-700">Error</h3>
    <p className="text-sm text-gray-400">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
      >
        Retry
      </button>
    )}
  </div>
)

export default ErrorState