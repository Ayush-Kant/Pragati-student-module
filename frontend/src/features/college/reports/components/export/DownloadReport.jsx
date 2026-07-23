import { Download, Loader2 } from "lucide-react";

export const DownloadReport = ({ onClick, isDownloading, label = "Download", isIcon = false, darkMode }) => {
  if (isIcon) {
    return (
      <button
        onClick={onClick}
        disabled={isDownloading}
        className={`p-1.5 rounded-lg transition duration-150 active:scale-95 cursor-pointer disabled:opacity-50 ${darkMode ? 'bg-[#1A1A1A] hover:bg-[#ff6d34]/10 text-gray-400 hover:text-[#ff6d34]' : 'bg-slate-100 hover:bg-primary-light text-slate-500 hover:text-primary'}`}
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
      className={`flex items-center space-x-2 px-3.5 py-2 disabled:opacity-50 text-xs font-semibold rounded-xl transition duration-150 active:scale-97 cursor-pointer ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D] text-gray-300 hover:bg-[#1A1A1A]' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
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
