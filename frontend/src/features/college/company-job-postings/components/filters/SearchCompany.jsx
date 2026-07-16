import { Search } from "lucide-react";

const SearchCompany = ({ value = "", onSearch }) => {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search company..."
        className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
      />
    </div>
  );
};

export default SearchCompany;