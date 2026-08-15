// src/features/student/placement/pages/JobApplicationsPage.jsx
// Main page for job applications tracking with search, filters, pagination, and table/card view switch.

import React, { useState } from 'react';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import PlacementNavigation from '../components/common/PlacementNavigation';
import ApplicationFilters from '../components/applications/ApplicationFilters';
import ApplicationTable from '../components/applications/ApplicationTable';
import JobCard from '../components/applications/JobCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { useApplications } from '../hooks/useApplications';

export default function JobApplicationsPage() {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const {
    applications,
    total,
    page,
    pageSize,
    totalPages,
    filters,
    setFilter,
    resetFilters,
    setPage,
    setPageSize,
    isLoading,
    isError,
    error,
    refetch,
  } = useApplications();

  return (
    <div className="min-h-screen bg-surface-50">
      <PlacementNavigation />

      <main className="page-container animate-fade-in">
        <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="page-title">Job Applications</h2>
            <p className="page-description">
              Track your campus recruitment drive submissions, test rounds, and interview schedules.
            </p>
          </div>

          {/* View Mode Toggle (Table / Grid) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-100 border border-surface-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-primary-700 shadow-2xs'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-primary-700 shadow-2xs'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <ApplicationFilters
          filters={filters}
          setFilter={setFilter}
          resetFilters={resetFilters}
          totalResults={total}
        />

        {/* Content View: Table vs Grid */}
        {viewMode === 'table' ? (
          <ApplicationTable
            applications={applications}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={refetch}
          />
        ) : (
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SkeletonLoader variant="card" count={6} />
              </div>
            ) : isError ? (
              <ErrorState
                title="Unable to load applications"
                message={error || 'Could not retrieve application cards.'}
                onRetry={refetch}
              />
            ) : applications.length === 0 ? (
              <EmptyState
                title="No Applications Found"
                description="No applications match your active filter parameters."
                icon="search"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.map((app) => (
                  <JobCard key={app.applicationId} application={app} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
