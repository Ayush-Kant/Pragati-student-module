import { Search, X } from "lucide-react";

export const SearchReport = ({ value, onChange, darkMode }) => {
  return (
    <div className="relative w-full">
      <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search reports by title..."
        className={`w-full pl-10 pr-10 py-2.5 text-sm font-medium rounded-xl border outline-none transition-all duration-200 focus:ring-4 ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D] text-gray-300 placeholder-gray-500 focus:border-[#ff6d34] focus:ring-[#ff6d34]/10' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-primary focus:ring-orange-500/10'}`}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition cursor-pointer ${darkMode ? 'text-gray-500 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchReport;
