// LevelFilter.jsx
// Dropdown filter for course difficulty level

import { COURSE_LEVELS } from "../../constants/trainingLearningConstants";

const LevelFilter = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="All">All Levels</option>
      {COURSE_LEVELS.map((lvl) => (
        <option key={lvl} value={lvl}>
          {lvl}
        </option>
      ))}
    </select>
  );
};

export default LevelFilter;
