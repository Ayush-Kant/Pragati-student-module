const LoadingSpinner = ({ message = "Loading...", darkMode }) => (
  <div className={`flex flex-col items-center justify-center py-20 gap-3 ${darkMode ? 'bg-[#1A1A1A]' : ''}`}>
    <div className={`w-10 h-10 border-4 rounded-full animate-spin ${darkMode ? 'border-[#3D3D3D] border-t-[#ff6d34]' : 'border-blue-200 border-t-blue-600'}`} />
    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{message}</p>
  </div>
)

export default LoadingSpinner