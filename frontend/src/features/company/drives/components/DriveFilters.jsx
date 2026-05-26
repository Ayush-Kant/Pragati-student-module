import { Search, Filter } from 'lucide-react';

export const DriveFilters = ({ filters, updateFilter, getUniqueValues }) => {
  const statuses = ['Active', 'Assessment', 'Interview', 'Screening'];
  const departments = getUniqueValues('department');
  const years = ['2024', '2025', '2026'];

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
      <div
        onClick={() => {
          const select = document.querySelector('select[data-filter="status"]');
          select?.click();
        }}
        className="h-14 min-w-[170px] rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <span>{filters.status || 'Status'}</span>
        <Filter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
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

      {/* Department Filter */}
      <div
        onClick={() => {
          const select = document.querySelector('select[data-filter="department"]');
          select?.click();
        }}
        className="h-14 min-w-[170px] rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <span>{filters.department || 'Department'}</span>
        <Filter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
      </div>
      <select
        value={filters.department}
        onChange={(e) => updateFilter('department', e.target.value)}
        data-filter="department"
        className="hidden"
      >
        <option value="">Department</option>
        {departments.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>

      {/* Year Filter */}
      <div
        onClick={() => {
          const select = document.querySelector('select[data-filter="year"]');
          select?.click();
        }}
        className="h-14 min-w-[170px] rounded-2xl border border-gray-200 bg-white px-5 flex items-center justify-between text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <span>{filters.year || 'Year'}</span>
        <Filter className="w-5 h-5 text-gray-400 shrink-0" size={20} />
      </div>
      <select
        value={filters.year}
        onChange={(e) => updateFilter('year', e.target.value)}
        data-filter="year"
        className="hidden"
      >
        <option value="">Year</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};
