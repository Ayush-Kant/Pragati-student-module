import { FILTERS } from "../../constants/assignmentConstants";

const STATUS_OPTIONS = [FILTERS.ALL, FILTERS.PENDING, FILTERS.COMPLETED];

const dotColor = {
  [FILTERS.ALL]: "bg-gray-400",
  [FILTERS.PENDING]: "bg-amber-400",
  [FILTERS.COMPLETED]: "bg-emerald-500",
};

const StatusFilter = ({ value, onChange }) => (
  <div className="app-filter-group flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
    {STATUS_OPTIONS.map((option) => (
      <button
        key={option}
        onClick={() => onChange(option)}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
          value === option
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor[option]}`} />
        {option}
      </button>
    ))}
  </div>
);

export default StatusFilter;
