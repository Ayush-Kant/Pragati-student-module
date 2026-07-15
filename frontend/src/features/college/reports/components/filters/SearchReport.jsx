import { Search, X } from "lucide-react";

export const SearchReport = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search reports by title..."
        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 text-sm font-medium rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-orange-500/10 transition-all duration-150 outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchReport;
