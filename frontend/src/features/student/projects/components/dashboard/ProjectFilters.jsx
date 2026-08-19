import { Search } from 'lucide-react';
import { STATUS_FILTER_OPTIONS } from '../../constants/projectConstants';

/**
 * Filter bar for the projects dashboard.
 * @param {{
 *   searchQuery: string,
 *   statusFilter: string,
 *   onSearchChange: Function,
 *   onStatusChange: Function,
 * }} props
 */
const ProjectFilters = ({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) => (
  <div className="space-y-4 mb-6 animate-slide-up">
    {/* Search */}
    <div className="relative">
      <label htmlFor="project-search" className="sr-only">Search projects</label>
      <input
        id="project-search"
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by title, tech stack…"
        className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#0a0a0a] border border-gray-800 text-gray-200 text-sm
          placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20
          hover:border-gray-700 transition-all duration-200"
      />
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" aria-hidden="true" />
    </div>

    {/* Status filter chips */}
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
      {STATUS_FILTER_OPTIONS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onStatusChange(s)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
            statusFilter === s
              ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
              : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
          }`}
          aria-pressed={statusFilter === s}
        >
          {s}
        </button>
      ))}
    </div>
  </div>
);

export default ProjectFilters;
