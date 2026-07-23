const LoadingSpinner = ({ darkMode }) => {
  return (
    <div className={`flex items-center justify-center h-60 ${darkMode ? 'bg-[#1A1A1A]' : ''}`}>
      <div className={`h-12 w-12 animate-spin rounded-full border-4 border-t-transparent ${darkMode ? 'border-[#ff6d34]' : 'border-blue-600'}`}></div>
    </div>
  );
};

export default LoadingSpinner;