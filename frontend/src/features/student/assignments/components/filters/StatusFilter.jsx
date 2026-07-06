import { FILTERS } from "../../constants/assignmentConstants";

const STATUS_OPTIONS = [FILTERS.ALL, FILTERS.PENDING, FILTERS.COMPLETED];

const StatusFilter = ({ value, onChange }) => (
  <div className="app-filter-group flex items-center gap-1.5 flex-wrap">
    {STATUS_OPTIONS.map((option) => (
      <button
        key={option}
        onClick={() => onChange(option)}
        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
          value === option
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}
      >
        {option}
      </button>
    ))}
  </div>
);

export default StatusFilter;
