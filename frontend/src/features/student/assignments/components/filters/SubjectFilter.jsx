import { FILTERS } from "../../constants/assignmentConstants";
import { BookOpen } from "lucide-react";

const SubjectFilter = ({ value, onChange, subjects = [] }) => {
  const options = [FILTERS.ALL, ...subjects];

  return (
    <div className="filter-container relative flex items-center">
      <div className="absolute left-3 pointer-events-none">
        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 shadow-sm cursor-pointer appearance-none"
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
