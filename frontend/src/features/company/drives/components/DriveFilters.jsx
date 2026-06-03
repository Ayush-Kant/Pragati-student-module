import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

export const DriveFilters = ({ filters, updateFilter, getUniqueValues }) => {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'status' | 'department' | 'year' | null

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.filter-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const statuses = ['All Statuses', 'Active', 'Assessment', 'Interview', 'Screening'];
  
  // Get unique values from the drive data for department/role
  const rawDepts = getUniqueValues('department') || [];
  const departments = ['All Departments', ...rawDepts];
  
  const years = ['All Years', '2024', '2025', '2026', '2027'];

  const handleSelect = (type, value) => {
    let filterVal = value;
    if (value === 'All Statuses' || value === 'All Departments' || value === 'All Years') {
      filterVal = '';
    }
    updateFilter(type, filterVal);
    setActiveDropdown(null);
  };

  return (
    <div className="mb-6 flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 flex items-center">
        <Search
          className="absolute left-4 text-gray-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search drives..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="
            w-full
            h-[56px]
            rounded-2xl
            border
            border-gray-200
            bg-[#fafafa]
            pl-16
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

      {/* Status Filter */}
      <div className="relative filter-container min-w-[170px]">
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'status' ? null : 'status')}
          className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <span>{filters.status || 'Status'}</span>
          <Filter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
        </div>
        {activeDropdown === 'status' && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
            {statuses.map(status => (
              <div
                key={status}
                onClick={() => handleSelect('status', status)}
                className={`px-5 py-3 hover:bg-gray-50 text-[14px] cursor-pointer transition font-medium ${
                  (filters.status === status || (!filters.status && status === 'All Statuses'))
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

      {/* Department Filter */}
      <div className="relative filter-container min-w-[170px]">
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'department' ? null : 'department')}
          className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <span>{filters.department || 'Department'}</span>
          <Filter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
        </div>
        {activeDropdown === 'department' && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 max-h-[240px] overflow-y-auto">
            {departments.map(dept => (
              <div
                key={dept}
                onClick={() => handleSelect('department', dept)}
                className={`px-5 py-3 hover:bg-gray-50 text-[14px] cursor-pointer transition font-medium ${
                  (filters.department === dept || (!filters.department && dept === 'All Departments'))
                    ? 'text-blue-600 bg-blue-50/50'
                    : 'text-gray-700'
                }`}
              >
                {dept}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Year Filter */}
      <div className="relative filter-container min-w-[170px]">
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'year' ? null : 'year')}
          className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <span>{filters.year || 'Year'}</span>
          <Filter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
        </div>
        {activeDropdown === 'year' && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
            {years.map(year => (
              <div
                key={year}
                onClick={() => handleSelect('year', year)}
                className={`px-5 py-3 hover:bg-gray-50 text-[14px] cursor-pointer transition font-medium ${
                  (filters.year === year || (!filters.year && year === 'All Years'))
                    ? 'text-blue-600 bg-blue-50/50'
                    : 'text-gray-700'
                }`}
              >
                {year}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

