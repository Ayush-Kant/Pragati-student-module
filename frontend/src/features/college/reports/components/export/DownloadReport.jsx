import React from "react";
import { Download, Loader2 } from "lucide-react";

export const DownloadReport = ({ onClick, isDownloading, label = "Download", isIcon = false }) => {
  if (isIcon) {
    return (
      <button
        onClick={onClick}
        disabled={isDownloading}
        className="p-1.5 bg-slate-100 hover:bg-primary-light text-slate-500 hover:text-primary disabled:opacity-50 rounded-lg transition duration-150 active:scale-95 cursor-pointer"
        title="Download Report"
      >
        {isDownloading ? (
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        ) : (
          <Download className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={isDownloading}
      className="flex items-center space-x-2 px-3.5 py-2 bg-primary hover:bg-primary-hover text-white disabled:opacity-50 text-xs font-semibold rounded-xl transition duration-150 shadow-md shadow-orange-500/10 active:scale-97 cursor-pointer"
    >
      {isDownloading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      <span>{label}</span>
    </button>
  );
};

export default DownloadReport;
