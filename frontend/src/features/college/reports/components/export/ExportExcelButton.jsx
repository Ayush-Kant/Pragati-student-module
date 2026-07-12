import React from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";

export const ExportExcelButton = ({ onClick, isExporting }) => {
  return (
    <button
      onClick={onClick}
      disabled={isExporting}
      className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 disabled:opacity-50 text-xs font-semibold rounded-xl border border-emerald-200/50 hover:border-emerald-300 transition duration-150 active:scale-97 cursor-pointer"
      title="Export report as Excel worksheet (.xls)"
    >
      {isExporting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <FileSpreadsheet className="w-3.5 h-3.5" />
      )}
      <span>Export Excel</span>
    </button>
  );
};

export default ExportExcelButton;
