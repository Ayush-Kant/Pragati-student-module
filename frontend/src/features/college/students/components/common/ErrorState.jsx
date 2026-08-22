const ErrorState = ({ message = "Something went wrong", onRetry, darkMode }) => (
  <div className={`flex flex-col items-center justify-center py-20 gap-3 ${darkMode ? 'bg-[#1A1A1A]' : ''}`}>
    <span className="text-6xl">⚠️</span>
    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>Error</h3>
    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 bg-[#ff6d34] text-white rounded-lg text-sm hover:bg-[#e85d2b] cursor-pointer"
      >
        Retry
      </button>
    )}
  </div>
)

export default ErrorState