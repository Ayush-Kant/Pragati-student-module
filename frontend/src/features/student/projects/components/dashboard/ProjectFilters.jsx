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
        className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm
          placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20
          hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-sm"
      />
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" aria-hidden="true" />
    </div>

    {/* Status filter chips */}
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
      {STATUS_FILTER_OPTIONS.map((s) => {
        const isSelected = statusFilter === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onStatusChange(s)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-150 active:scale-95 ${
              isSelected
                ? 'font-bold shadow-sm'
                : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
            }`}
            style={
              isSelected
                ? { backgroundColor: '#4F46E5', borderColor: '#4F46E5', color: '#ffffff' }
                : undefined
            }
            aria-pressed={isSelected}
          >
            {s}
          </button>
        );
      })}
    </div>
  </div>
);

export default ProjectFilters;
