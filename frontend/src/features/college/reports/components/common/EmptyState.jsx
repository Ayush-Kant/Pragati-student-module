import React from "react";
import { FolderOpen } from "lucide-react";

export const EmptyState = ({ 
  title = "No Reports Found", 
  message = "We couldn't find any reports matching your active filters. Try adjusting your search query or filters.", 
  onReset 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm max-w-lg mx-auto my-8">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-55 bg-orange-50 text-primary mb-4">
        <FolderOpen className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition duration-150 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-97 cursor-pointer"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
