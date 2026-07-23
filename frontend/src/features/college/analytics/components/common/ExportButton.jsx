import { Download } from "lucide-react";

export const ExportButton = ({ onClick, disabled = false, darkMode = false, format = "PDF" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md hover:-translate-y-0.5"
    } bg-[#00bea3] text-white hover:bg-[#009e88]`}
  >
    <Download className="w-3.5 h-3.5" />
    Export {format}
  </button>
);
