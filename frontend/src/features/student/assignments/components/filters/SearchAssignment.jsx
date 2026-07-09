import { Search } from "lucide-react";

const SearchAssignment = ({ value, onChange }) => (
  <div className="relative flex-1">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Search size={18} className="text-gray-400" />
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search assignments..."
      className="w-full pl-9 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-shadow"
    />
  </div>
);

export default SearchAssignment;
