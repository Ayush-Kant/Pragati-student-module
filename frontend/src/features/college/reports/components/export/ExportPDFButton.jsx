import { FileText, Loader2 } from "lucide-react";

export const ExportPDFButton = ({ onClick, isExporting, darkMode }) => {
  return (
    <button
      onClick={onClick}
      disabled={isExporting}
      className={`flex items-center justify-center space-x-2 px-4 py-2 disabled:opacity-50 text-xs font-semibold rounded-xl border transition duration-150 active:scale-97 cursor-pointer ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D] text-gray-300 hover:bg-[#1A1A1A] hover:text-white' : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200/50 hover:border-red-300'}`}
      title="Export report as PDF and Print"
    >
      {isExporting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <FileText className="w-3.5 h-3.5" />
      )}
      <span>Export PDF</span>
    </button>
  );
};

export default ExportPDFButton;
