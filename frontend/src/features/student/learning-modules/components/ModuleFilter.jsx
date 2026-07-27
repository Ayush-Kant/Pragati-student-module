import { Search, X } from "lucide-react";
import { useState } from "react";
import { MODULE_CATEGORIES } from "../constants/learningConstants";

/**
 * ModuleFilter component with search input and category dropdown.
 *
 * @param {object} props
 * @param {string[]} props.categories - Available categories.
 * @param {function} props.onFilterChange - Callback with { category, query }.
 * @returns {JSX.Element}
 */
const ModuleFilter = ({ categories = [], onFilterChange }) => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    onFilterChange?.({ category: selectedCategory, query: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    onFilterChange?.({ category: e.target.value, query });
  };

  const handleReset = () => {
    setQuery("");
    setSelectedCategory("All");
    onFilterChange?.({ category: "All", query: "" });
  };

  const hasFilters = query || selectedCategory !== "All";

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search modules..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-2 focus:ring-offset-[#050505] bg-[#0a0a0a] text-gray-200 placeholder-gray-500 transition-all duration-300"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                onFilterChange?.({ category: selectedCategory, query: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <div className="md:w-48">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2.5 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-2 focus:ring-offset-[#050505] bg-[#0a0a0a] text-gray-200 hover:border-orange-500/30 transition-all duration-200"
          >
            <option value="All">All Categories</option>
            {Object.values(MODULE_CATEGORIES).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        {hasFilters && (
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-300 bg-[#0a0a0a] rounded-lg hover:bg-[#111111] hover:border-orange-500/30 border border-gray-700 transition-all duration-300 cursor-pointer"
          >
            <X size={16} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default ModuleFilter;
