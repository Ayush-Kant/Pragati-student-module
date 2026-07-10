// SearchCourse.jsx
// Search input for filtering courses by title / instructor

const SearchCourse = ({ value, onChange }) => {
  return (
    <div className="relative w-full sm:w-72">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search courses or instructors..."
        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default SearchCourse;
