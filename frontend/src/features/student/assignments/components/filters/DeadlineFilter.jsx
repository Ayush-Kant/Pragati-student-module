import { CalendarDays } from "lucide-react";

const DEADLINE_OPTIONS = [
  { label: "Upcoming First", value: "upcoming" },
  { label: "Overdue First", value: "overdue" },
  { label: "Latest First", value: "latest" },
];

const DeadlineFilter = ({ value, onChange, darkMode = false }) => (
  <div className="filter-container relative flex items-center">
    <div className="absolute left-3 pointer-events-none">
      <CalendarDays className={`w-3.5 h-3.5 ${darkMode ? "text-slate-500" : "text-gray-400"}`} />
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-sm border rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 shadow-sm cursor-pointer appearance-none ${
        darkMode
          ? "bg-slate-700 border-slate-600 text-slate-200"
          : "bg-white border-gray-200 text-gray-700"
      }`}
    >
      {DEADLINE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export { DEADLINE_OPTIONS };
export default DeadlineFilter;
