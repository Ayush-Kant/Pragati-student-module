import { FILTERS } from "../../constants/assignmentConstants";

const SubjectFilter = ({ value, onChange, subjects = [] }) => {
  const options = [FILTERS.ALL, ...subjects];

  return (
    <div className="filter-container">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer"
      >
        {options.map((subject) => (
          <option key={subject} value={subject}>
            {subject === FILTERS.ALL ? "All Subjects" : subject}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SubjectFilter;
