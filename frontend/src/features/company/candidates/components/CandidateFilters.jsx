import { Search, Filter } from 'lucide-react';
import { FiFilter } from 'react-icons/fi';

export const CandidateFilters = ({ filters, updateFilter, getUniqueValues, allCandidates }) => {
  const statuses = ['Shortlisted', 'Assessment', 'Interview', 'Rejected', 'Offered'];
  const colleges = getUniqueValues('college');
  const roles = getUniqueValues('role');

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

      {/* Status Filter */}
      <div
        onClick={() => {
          const select = document.querySelector('select[data-filter="status"]');
          select?.click();
        }}
        className="h-14 min-w-[170px] rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <span>{filters.status || 'Status'}</span>
        <FiFilter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
      </div>
      <select
        value={filters.status}
        onChange={(e) => updateFilter('status', e.target.value)}
        data-filter="status"
        className="hidden"
      >
        <option value="">Status</option>
        {statuses.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>

      {/* College Filter */}
      <div
        onClick={() => {
          const select = document.querySelector('select[data-filter="college"]');
          select?.click();
        }}
        className="h-14 min-w-[170px] rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <span>{filters.college || 'College'}</span>
        <FiFilter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
      </div>
      <select
        value={filters.college}
        onChange={(e) => updateFilter('college', e.target.value)}
        data-filter="college"
        className="hidden"
      >
        <option value="">College</option>
        {colleges.map(college => (
          <option key={college} value={college}>{college}</option>
        ))}
      </select>

      {/* Role Filter */}
      <div
        onClick={() => {
          const select = document.querySelector('select[data-filter="role"]');
          select?.click();
        }}
        className="h-14 min-w-[170px] rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <span>{filters.role || 'Role'}</span>
        <FiFilter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
      </div>
      <select
        value={filters.role}
        onChange={(e) => updateFilter('role', e.target.value)}
        data-filter="role"
        className="hidden"
      >
        <option value="">Role</option>
        {roles.map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
    </div>
  );
};
