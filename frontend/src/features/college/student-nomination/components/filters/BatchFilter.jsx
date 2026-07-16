import { useOutletContext } from "react-router-dom";
import { CalendarDays, ChevronDown } from "lucide-react";

const currentYear = new Date().getFullYear();

const batches = Array.from(
  { length: 6 },
  (_, index) => currentYear - index
);

const BatchFilter = ({
  value,
  onChange,
}) => {
  const { darkMode } = useOutletContext();

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 ease-out
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
      <CalendarDays
        size={18}
        className={`shrink-0 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      />

      <select
        value={value}
        onChange={onChange}
        className={`flex-1 appearance-none bg-transparent outline-none text-sm font-medium cursor-pointer ${
          darkMode ? "text-white" : "text-slate-700"
        }`}
      >
        <option
          value=""
          className={
            darkMode
              ? "bg-[#151D30] text-white"
              : "bg-white text-slate-900"
          }
        >
          All Batches
        </option>

        {batches.map((batch) => (
          <option
            key={batch}
            value={batch}
            className={
              darkMode
                ? "bg-[#151D30] text-white"
                : "bg-white text-slate-900"
            }
          >
            {batch}
          </option>
        ))}
      </select>

      <ChevronDown
        size={18}
        className={`shrink-0 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      />
    </div>
  );
};

export default BatchFilter;