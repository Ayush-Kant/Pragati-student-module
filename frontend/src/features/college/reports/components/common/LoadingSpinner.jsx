export const LoadingSpinner = ({ message = "Loading reports...", darkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className={`absolute inset-0 rounded-full border-4 ${darkMode ? 'border-[#ff6d34]/20' : 'border-primary-light'}`}></div>
        {/* Spinning Arc */}
        <div className={`absolute inset-0 rounded-full border-4 border-transparent animate-spin ${darkMode ? 'border-t-[#ff6d34]' : 'border-t-primary'}`}></div>
      </div>
      <p className={`text-sm font-medium animate-pulse ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
