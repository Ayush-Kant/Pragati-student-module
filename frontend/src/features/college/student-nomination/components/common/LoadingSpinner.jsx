import React from "react";

/**
 * Visual loading loop tailored to fit layout components while backend async work resolves.
 */
const LoadingSpinner = ({ label = "Synchronizing records..." }) => {
  
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      <span className="text-sm text-slate-500 font-medium tracking-wide animate-pulse">{label}</span>
    </div>
  );
};

export default LoadingSpinner;