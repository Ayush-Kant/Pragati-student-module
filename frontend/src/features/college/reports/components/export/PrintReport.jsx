import { Printer } from "lucide-react";

export const PrintReport = ({ onClick, label = "Print", isIcon = false }) => {
  if (isIcon) {
    return (
      <button
        onClick={onClick}
        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-lg transition duration-150 active:scale-95 cursor-pointer"
        title="Print Report"
      >
        <Printer className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition duration-150 active:scale-97 cursor-pointer"
    >
      <Printer className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};

export default PrintReport;
