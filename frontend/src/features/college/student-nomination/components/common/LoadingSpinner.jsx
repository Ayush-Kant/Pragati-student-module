import React from "react";
import { useOutletContext } from "react-router-dom";

const LoadingSpinner = ({ label = "Synchronizing records...", fullHeight = false }) => {
  const { darkMode = false } = useOutletContext() || {};
  
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 select-none ${
        fullHeight ? "min-h-[350px] flex-1 w-full" : ""
      }`}
    >
      {/* Spinner Ring */}
      <div
        className={`w-10 h-10 border-4 rounded-full motion-safe:animate-spin ${
          darkMode
            ? "border-[#3D3D3D] border-t-[#ff6d34]"
            : "border-slate-200 border-t-[#ff7a00]"
        }`}
        role="status"
        aria-label="Loading"
      />

      {/* Loading Label */}
      <span
        className={`text-sm font-medium tracking-wide motion-safe:animate-pulse ${
          darkMode ? "text-gray-400" : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default LoadingSpinner;