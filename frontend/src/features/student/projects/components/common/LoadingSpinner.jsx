import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ label = "Loading data...", size = "md" }) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 min-h-[200px]">
      <Loader2 className={`${sizeMap[size]} text-brand-600 animate-spin`} />
      {label && <p className="text-sm font-medium text-surface-500 animate-pulse">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
