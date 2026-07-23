import React from "react";
import { useOutletContext } from "react-router-dom";

const LoadingSpinner = ({ label = "Synchronizing records..." }) => {
  const context = useOutletContext();
  const darkMode = context?.darkMode ?? false;
  
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className={`w-10 h-10 border-4 ${darkMode ? "border-[#3D3D3D] border-t-[#ff6d34]" : "border-slate-200 border-t-[#ff7a00]"} rounded-full animate-spin`} />
      <span className={`text-sm font-medium tracking-wide animate-pulse ${darkMode ? "text-gray-400" : "text-slate-500"}`}>{label}</span>
    </div>
  );
};

export default LoadingSpinner;