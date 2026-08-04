import { Search } from "lucide-react";

const SearchCompany = ({ value = "", onSearch, darkMode }) => {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search company..."
        className={`w-full rounded-lg py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
          darkMode
            ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white placeholder-gray-500'
            : 'border border-slate-300 focus:border-blue-500 focus:ring-blue-200'
        }`}
      />
    </div>
  );
};

export default SearchCompany;