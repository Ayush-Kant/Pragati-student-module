import { Search } from "lucide-react";

const SearchAssignment = ({ value, onChange }) => (
  <div className="relative flex-1">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
      <Search size={16} className="text-gray-400" />
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search assignments by title or subject..."
      className="w-full pl-9 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder:text-gray-400 transition-all duration-200 shadow-sm"
    />
  </div>
);

export default SearchAssignment;
