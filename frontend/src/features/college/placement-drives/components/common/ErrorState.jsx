const ErrorState = ({
    message = "Something went wrong.",
    onRetry,
    darkMode,
  }) => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-5xl">⚠️</div>
  
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
          Error
        </h2>
  
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {message}
        </p>
  
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-5 rounded-lg bg-[#ff7a00] px-5 py-2 text-white transition hover:bg-[#e06b00]"
          >
            Retry
          </button>
        )}
      </div>
    );
  };
  
  export default ErrorState;