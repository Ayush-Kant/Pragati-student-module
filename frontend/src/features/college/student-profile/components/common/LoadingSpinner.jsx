import React from "react";

export const LoadingSpinner = ({ message = "Loading student details...", darkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className={`w-12 h-12 rounded-full border-4 animate-pulse ${darkMode ? 'border-[#3D3D3D]' : 'border-indigo-100'}`}></div>
        {/* Spinning Arch */}
        <div className={`absolute w-12 h-12 rounded-full border-4 border-r-transparent border-b-transparent border-l-transparent animate-spin ${darkMode ? 'border-t-[#ff6d34]' : 'border-t-indigo-600'}`}></div>
      </div>
      <p className={`mt-4 text-sm font-medium animate-pulse ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
