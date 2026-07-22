import { AlertCircle, RotateCcw } from "lucide-react";

export const ErrorState = ({ 
  message = "Failed to load reports data. Please verify your connection and try again.", 
  onRetry,
  darkMode 
}) => {
  return (
    <div className={`p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 max-w-2xl mx-auto my-6 shadow-sm ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-red-50 border border-red-100'}`}>
      <div className={`flex-shrink-0 p-2 rounded-xl ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="flex-grow text-center sm:text-left">
        <h4 className={`text-base font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-900'}`}>System Error Encountered</h4>
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-red-700'}`}>{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-xl border transition duration-150 active:scale-97 cursor-pointer ${darkMode ? 'bg-[#1A1A1A] hover:bg-[#3D3D3D] text-gray-300 border-[#3D3D3D]' : 'bg-white hover:bg-red-100 text-red-700 border-red-200'}`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Load</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
