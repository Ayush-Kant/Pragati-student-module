import { useState, useEffect } from 'react';
import { Search, Download, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { FiFilter } from 'react-icons/fi';

export const CandidateFilters = ({ 
  filters, 
  updateFilter, 
  getUniqueValues, 
  exportCandidates, 
  resetFilters 
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'status' | 'college' | 'role' | null
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.filter-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const statuses = ['All Statuses', 'Shortlisted', 'Assessment', 'Interview', 'Rejected'];

  const rawColleges = getUniqueValues('college') || [];
  const colleges = ['All Colleges', ...rawColleges];

  const rawRoles = getUniqueValues('role') || [];
  const roles = ['All Roles', ...rawRoles];

  const handleSelect = (type, value) => {
    let filterVal = value;
    if (value === 'All Statuses' || value === 'All Colleges' || value === 'All Roles') {
      filterVal = '';
    }
    updateFilter(type, filterVal);
    setActiveDropdown(null);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Main Filter Bar */}
      <div className="app-filter-bar flex flex-col lg:flex-row items-stretch lg:items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full lg:flex-1 flex items-center">
          <Search
            className="absolute left-4 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search candidates by name, college, email..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="
              w-full
              h-[56px]
              rounded-2xl
              border
              border-gray-200
              bg-[#fafafa]
              pl-12
              pr-4
              text-[16px]
              text-gray-700
              placeholder:text-gray-400
              outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-transparent
            "
          />
        </div>

        {/* Action Buttons & Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Dropdown */}
          <div className="relative filter-container min-w-[150px]">
            <div
              onClick={() => setActiveDropdown(activeDropdown === 'status' ? null : 'status')}
              className="h-14 rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <span>{filters.status || 'Status'}</span>
              <FiFilter className="w-5 h-5 text-gray-400 shrink-0 ml-2" size={18} />
            </div>
            {activeDropdown === 'status' && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[180px] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                {statuses.map(status => (
                  <div
                    key={status}
                    onClick={() => handleSelect('status', status)}
                    className={`px-5 py-3 hover:bg-gray-50 text-[14px] cursor-pointer transition font-medium ${(filters.status === status || (!filters.status && status === 'All Statuses'))
                        ? 'text-blue-600 bg-blue-50/50'
                        : 'text-gray-700'
                      }`}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* College Dropdown */}
          <div className="relative filter-container min-w-[160px]">
            <div
              onClick={() => setActiveDropdown(activeDropdown === 'college' ? null : 'college')}
              className="h-14 rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <span className="truncate max-w-[120px]">{filters.college || 'College'}</span>
              <FiFilter className="w-5 h-5 text-gray-400 shrink-0 ml-2" size={18} />
            </div>
            {activeDropdown === 'college' && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 max-h-[240px] overflow-y-auto">
                {colleges.map(college => (
                  <div
                    key={college}
                    onClick={() => handleSelect('college', college)}
                    className={`px-5 py-3 hover:bg-gray-50 text-[14px] cursor-pointer transition font-medium ${(filters.college === college || (!filters.college && college === 'All Colleges'))
                        ? 'text-blue-600 bg-blue-50/50'
                        : 'text-gray-700'
                      }`}
                  >
                    {college}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Advanced toggle button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`h-14 px-5 border rounded-2xl flex items-center justify-center gap-2 font-medium transition shrink-0 ${
              showAdvanced ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}
          >
            <SlidersHorizontal size={18} />
            <span>Advanced</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="h-14 px-4 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center gap-2 font-medium transition shrink-0"
            title="Reset Filters"
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>

          {/* Export CSV button */}
          <button
            onClick={exportCandidates}
            className="h-14 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg transition shrink-0"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable Panel */}
      {showAdvanced && (
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-fadeIn">
          {/* Skills Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Required Skill</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js"
              value={filters.skills}
              onChange={(e) => updateFilter('skills', e.target.value)}
              className="h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-[#fafafa]"
            />
          </div>

          {/* Location Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
            <input
              type="text"
              placeholder="e.g. Mumbai, Bangalore"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-[#fafafa]"
            />
          </div>

          {/* Min GPA Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Min GPA ({filters.gpa || '0.0'})</label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filters.gpa || 0}
              onChange={(e) => updateFilter('gpa', e.target.value === '0' ? '' : e.target.value)}
              className="h-11 cursor-pointer accent-blue-600"
            />
          </div>

          {/* Min Assessment Score Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Min Score ({filters.assessmentScore || '0'}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.assessmentScore || 0}
              onChange={(e) => updateFilter('assessmentScore', e.target.value === '0' ? '' : e.target.value)}
              className="h-11 cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};
