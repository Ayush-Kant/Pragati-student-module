const DEADLINE_OPTIONS = [
  { label: "Upcoming First", value: "upcoming" },
  { label: "Overdue First", value: "overdue" },
  { label: "Latest First", value: "latest" },
];

const DeadlineFilter = ({ value, onChange }) => (
  <div className="filter-container">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer"
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
