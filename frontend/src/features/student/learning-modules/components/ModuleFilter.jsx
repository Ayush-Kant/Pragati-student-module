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
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search modules..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                onFilterChange?.({ category: selectedCategory, query: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition cursor-pointer"
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
