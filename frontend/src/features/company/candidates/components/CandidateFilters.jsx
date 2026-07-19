import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { FiFilter } from 'react-icons/fi';

export const CandidateFilters = ({ filters, updateFilter, getUniqueValues }) => {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'status' | 'college' | 'role' | null

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.filter-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const statuses = ['All Statuses', 'Shortlisted', 'Assessment', 'Interview'];

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
    <div className="app-filter-bar mb-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
      {/* Search Input */}
      <div className="relative w-full lg:flex-1 flex items-center">
        <Search
          className="absolute left-4 text-gray-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search candidates..."
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

      {/* Filter Options Group */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
        {/* Status Filter */}
        <div className="relative filter-container w-full sm:w-auto sm:min-w-[170px] flex-1 sm:flex-none">
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'status' ? null : 'status')}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            <span>{filters.status || 'Status'}</span>
            <FiFilter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
          </div>
          {activeDropdown === 'status' && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
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

        {/* College Filter */}
        <div className="relative filter-container w-full sm:w-auto sm:min-w-[170px] flex-1 sm:flex-none">
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'college' ? null : 'college')}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            <span>{filters.college || 'College'}</span>
            <FiFilter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
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

        {/* Role Filter */}
        <div className="relative filter-container w-full sm:w-auto sm:min-w-[170px] flex-1 sm:flex-none">
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'role' ? null : 'role')}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            <span>{filters.role || 'Role'}</span>
            <FiFilter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
          </div>
          {activeDropdown === 'role' && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 max-h-[240px] overflow-y-auto">
              {roles.map(role => (
                <div
                  key={role}
                  onClick={() => handleSelect('role', role)}
                  className={`px-5 py-3 hover:bg-gray-50 text-[14px] cursor-pointer transition font-medium ${(filters.role === role || (!filters.role && role === 'All Roles'))
                      ? 'text-blue-600 bg-blue-50/50'
                      : 'text-gray-700'
                    }`}
                >
                  {role}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
