import React from 'react';

const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center gap-4 p-6 bg-white/90 rounded-lg shadow-lg">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" aria-hidden="true"></div>
        <div className="text-sm font-medium text-gray-800">{message}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
