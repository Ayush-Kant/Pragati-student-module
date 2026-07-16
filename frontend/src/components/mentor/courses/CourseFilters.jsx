import React, { useState } from 'react';
import { Search, ChevronDown } from "lucide-react";

export default function CourseFilters({ 
  searchQuery, setSearchQuery, 
  selectedCategory, setSelectedCategory, 
  selectedStatus, setSelectedStatus 
}) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const categories = ["All", "Web Development", "Data Science", "Design"];
  const statuses = ["All", "Published", "Draft", "Archived"];

  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses by title or category..."
          className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 outline-none transition focus:border-blue-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Custom Category Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setCategoryOpen(!categoryOpen); setStatusOpen(false); }}
            className="cursor-pointer flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {selectedCategory === "All" ? "All Categories" : selectedCategory}
            <ChevronDown size={16} className={`transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {categoryOpen && (
            <div className="absolute left-0 mt-2 z-30 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCategoryOpen(false); }}
                  className={`w-full rounded-lg px-4 py-2 text-left text-sm transition hover:bg-gray-50 ${selectedCategory === cat ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-gray-700'}`}
                >
                  {cat === "All" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Status Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setStatusOpen(!statusOpen); setCategoryOpen(false); }}
            className="cursor-pointer flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {selectedStatus === "All" ? "All Status" : selectedStatus}
            <ChevronDown size={16} className={`transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {statusOpen && (
            <div className="absolute left-0 mt-2 z-30 w-44 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
              {statuses.map((stat) => (
                <button
                  key={stat}
                  onClick={() => { setSelectedStatus(stat); setStatusOpen(false); }}
                  className={`w-full rounded-lg px-4 py-2 text-left text-sm transition hover:bg-gray-50 ${selectedStatus === stat ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-gray-700'}`}
                >
                  {stat === "All" ? "All Status" : stat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}