import { useOutletContext } from "react-router-dom";
import { Search } from "lucide-react";

const SearchStudent = ({
  value,
  onChange,
  placeholder = "Search Name or Enrollment Number",
}) => {
  const { darkMode } = useOutletContext();

  return (
    <div
      className={`flex items-center rounded-2xl border px-4 py-3 gap-3 transition-all duration-200 ease-out
    ${
      darkMode
        ? `
          border-slate-700/60
          hover:border-slate-600
          bg-[#151D30]
          focus-within:border-blue-500/70
          focus-within:ring-4
          focus-within:ring-blue-500/10
        `
        : `
          border-slate-300
          hover:border-slate-400
          bg-white
          focus-within:border-blue-500
          focus-within:ring-4
          focus-within:ring-blue-500/10
        `
    }`}
    >
      <Search
        size={18}
        strokeWidth={2.2}
        className={`shrink-0 ${
          darkMode
            ? `
            text-slate-400`
            : `
            text-slate-500
            `
        }`}
      />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Search Students"
        className={`flex-1 bg-transparent outline-none text-sm
${
  darkMode
    ? "text-white placeholder:text-slate-500"
    : "text-slate-900 placeholder:text-slate-400"
}`}
      />
    </div>
  );
};

export default SearchStudent;
