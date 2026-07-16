import React from "react";

export const LoadingSpinner = ({ message = "Loading student details..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 animate-pulse"></div>
        {/* Spinning Arch */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
