// SessionFilter.jsx
// Segmented filter for session status (All / Upcoming / Live / Completed)

import { SESSION_FILTERS } from "../constants/liveSessionsConstants";

const SessionFilter = ({ value, onChange }) => (
  <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
    {SESSION_FILTERS.map((filter) => (
      <button
        key={filter}
        onClick={() => onChange(filter)}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          value === filter ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {filter}
      </button>
    ))}
  </div>
);

export default SessionFilter;
