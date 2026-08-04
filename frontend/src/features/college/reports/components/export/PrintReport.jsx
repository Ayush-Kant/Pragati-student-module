import { Printer } from "lucide-react";

export const PrintReport = ({ onClick, label = "Print", isIcon = false, darkMode }) => {
  if (isIcon) {
    return (
      <button
        onClick={onClick}
        className={`p-1.5 rounded-lg transition duration-150 active:scale-95 cursor-pointer ${darkMode ? 'bg-[#1A1A1A] hover:bg-[#3D3D3D] text-gray-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700'}`}
        title="Print Report"
      >
        <Printer className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition duration-150 active:scale-97 cursor-pointer ${darkMode ? 'bg-[#2D2D2D] hover:bg-[#1A1A1A] border border-[#3D3D3D] text-gray-300' : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'}`}
    >
      <Printer className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};

export default PrintReport;
