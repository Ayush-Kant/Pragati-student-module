// StatusFilter.jsx
// Dropdown filter for course completion status

import { COURSE_STATUS } from "../../constants/trainingLearningConstants";

const StatusFilter = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="All">All Statuses</option>
      {Object.values(COURSE_STATUS).map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default StatusFilter;
