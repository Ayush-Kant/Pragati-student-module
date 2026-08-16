// src/features/student/placement/components/applications/ApplicationFilters.jsx
// Application filter toolbar wired to useApplications state.
// Debounced internally via hook, so typing does not trigger excess network calls.

import React from 'react';
import { Search, Filter, RotateCcw, Calendar, Briefcase, Tag } from 'lucide-react';
import {
  APPLICATION_STATUS,
  JOB_TYPE,
  DATE_RANGE_PRESET,
} from '../../constants/placementConstants';

export default function ApplicationFilters({
  filters,
  setFilter,
  resetFilters,
  totalResults = 0,
}) {
  const hasActiveFilters = Boolean(
    filters.status ||
      filters.jobType ||
      filters.location ||
      filters.search ||
      filters.dateRange
  );

  return (
    <div className="card p-4 sm:p-5 shadow-card mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search company or role title..."
            value={filters.search || ''}
            onChange={(e) => setFilter('search', e.target.value)}
            className="input pl-10 pr-4 py-2 text-xs sm:text-sm"
          />
        </div>

        {/* Dropdown Filters Group */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex items-center gap-2.5 flex-wrap">
          {/* 1. Status Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={filters.status || ''}
              onChange={(e) => setFilter('status', e.target.value)}
              className="select py-2 pl-3 pr-8 text-xs font-medium text-surface-700 bg-surface-50 border-surface-200"
              aria-label="Filter by Status"
            >
              <option value="">All Statuses</option>
              {Object.values(APPLICATION_STATUS).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Job Type Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={filters.jobType || ''}
              onChange={(e) => setFilter('jobType', e.target.value)}
              className="select py-2 pl-3 pr-8 text-xs font-medium text-surface-700 bg-surface-50 border-surface-200"
              aria-label="Filter by Job Type"
            >
              <option value="">All Job Types</option>
              {Object.values(JOB_TYPE).map((jt) => (
                <option key={jt} value={jt}>
                  {jt}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Date Range Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={filters.dateRange || ''}
              onChange={(e) => setFilter('dateRange', e.target.value)}
              className="select py-2 pl-3 pr-8 text-xs font-medium text-surface-700 bg-surface-50 border-surface-200"
              aria-label="Filter by Date Range"
            >
              <option value="">All Time</option>
              <option value={DATE_RANGE_PRESET.LAST_7_DAYS}>Last 7 Days</option>
              <option value={DATE_RANGE_PRESET.LAST_30_DAYS}>Last 30 Days</option>
              <option value={DATE_RANGE_PRESET.LAST_90_DAYS}>Last 90 Days</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="btn px-3 py-2 text-xs bg-surface-100 text-surface-700 hover:bg-surface-200 rounded-xl inline-flex items-center gap-1.5 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between text-xs text-surface-500">
        <span>
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'application' : 'applications'}
        </span>
        {hasActiveFilters && (
          <span className="text-2xs text-primary-600 font-medium">
            Filtered view active
          </span>
        )}
      </div>
    </div>
  );
}
