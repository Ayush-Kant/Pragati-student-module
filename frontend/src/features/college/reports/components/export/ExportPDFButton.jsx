import React from "react";
import { FileText, Loader2 } from "lucide-react";

export const ExportPDFButton = ({ onClick, isExporting }) => {
  return (
    <button
      onClick={onClick}
      disabled={isExporting}
      className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 disabled:opacity-50 text-xs font-semibold rounded-xl border border-red-200/50 hover:border-red-300 transition duration-150 active:scale-97 cursor-pointer"
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
