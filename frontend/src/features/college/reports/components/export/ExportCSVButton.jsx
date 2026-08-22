import { Database, Loader2 } from "lucide-react";

export const ExportCSVButton = ({ onClick, isExporting, darkMode }) => {
  return (
    <button
      onClick={onClick}
      disabled={isExporting}
      className={`flex items-center justify-center space-x-2 px-4 py-2 disabled:opacity-50 text-xs font-semibold rounded-xl border transition duration-150 active:scale-97 cursor-pointer ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D] text-gray-300 hover:bg-[#1A1A1A] hover:text-white' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border-blue-200/50 hover:border-blue-300'}`}
      title="Export report as raw comma separated values (.csv)"
    >
      {isExporting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Database className="w-3.5 h-3.5" />
      )}
      <span>Export CSV</span>
    </button>
  );
};

export default ExportCSVButton;
