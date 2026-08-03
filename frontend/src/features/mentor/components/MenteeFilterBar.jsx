import React from "react";
import { Search, ArrowUpDown } from "lucide-react";

export default function MenteeFilterBar({
  searchTerm,
  setSearchTerm,
  filters,
  handleFilterChange,
  sortBy,
  setSortBy,
  filterOptions = { courses: [], batches: [] }
}) {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (key) => (e) => {
    handleFilterChange(key, e.target.value);
  };

  return (
    <div className="sticky top-[69px] z-10 -mx-6 bg-slate-50/90 backdrop-blur-md px-6 py-4 border-b border-slate-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Filter by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] placeholder-slate-400"
          />
          <span className="absolute left-3.5 top-3 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
        </div>

        {/* Dropdowns Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Course Filter */}
          <div className="relative">
            <select
              value={filters.course}
              onChange={handleSelectChange("course")}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-600 outline-none transition-all focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] cursor-pointer"
            >
              <option value="All">Course: All</option>
              {filterOptions.courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-3 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Batch Filter */}
          <div className="relative">
            <select
              value={filters.batch}
              onChange={handleSelectChange("batch")}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-600 outline-none transition-all focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] cursor-pointer"
            >
              <option value="All">Batch: All</option>
              {filterOptions.batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-3 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={handleSelectChange("status")}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-600 outline-none transition-all focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="ACTIVE">Active</option>
              <option value="AT RISK">At Risk</option>
              <option value="COMPLETED">Completed</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <div className="pointer-events-none absolute right-3.5 top-3 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Sort By Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-600 outline-none transition-all focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] cursor-pointer"
            >
              <option value="name">Sort By: Name</option>
              <option value="progress">Sort By: Progress</option>
              <option value="attendance">Sort By: Attendance</option>
              <option value="lastActive">Sort By: Last Active</option>
            </select>
            <span className="absolute left-3.5 top-3 text-slate-400">
              <ArrowUpDown className="h-4 w-4" />
            </span>
            <div className="pointer-events-none absolute right-3.5 top-3 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
