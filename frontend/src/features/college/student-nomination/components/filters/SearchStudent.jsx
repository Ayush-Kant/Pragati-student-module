import { useOutletContext } from "react-router-dom";
import { Search, X } from "lucide-react";

const SearchStudent = ({
  value = "",
  onChange,
  placeholder = "Search Name or Enrollment Number",
}) => {
  // Safe outlet context fallback
  const { darkMode = false } = useOutletContext() || {};

  const handleClear = () => {
    if (onChange) {
      onChange({
        target: {
          value: "",
        },
      });
    }
  };

  return (
    <div
      className={`flex items-center rounded-2xl border px-4 py-3 gap-3 transition-all duration-200 ease-out
        ${
          darkMode
            ? "border-[#3D3D3D] bg-[#2D2D2D] focus-within:border-[#ff6d34]/70 focus-within:ring-4 focus-within:ring-[#ff6d34]/10"
            : "border-slate-300 bg-white focus-within:border-[#ff7a00] focus-within:ring-4 focus-within:ring-[#ff7a00]/10"
        }`}
    >
      <Search
        size={18}
        strokeWidth={2.2}
        className={`shrink-0 ${darkMode ? "text-gray-400" : "text-slate-500"}`}
      />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Search Students"
        className={`flex-1 bg-transparent outline-none text-sm [&::-webkit-search-cancel-button]:appearance-none ${
          darkMode
            ? "text-white placeholder:text-slate-500"
            : "text-slate-900 placeholder:text-slate-400"
        }`}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          className={`p-0.5 rounded-full transition-colors shrink-0 ${
            darkMode
              ? "text-slate-400 hover:text-white hover:bg-[#3D3D3D]"
              : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          }`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchStudent;