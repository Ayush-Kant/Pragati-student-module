// src/features/student/placement/components/applications/ApplicationTable.jsx
// Full data table for job applications supporting pagination and large datasets.

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  buildApplicationDetailsRoute,
  PAGE_SIZE_OPTIONS,
} from '../../constants/placementConstants';
import { formatDate } from '../../utils/placementHelpers';
import { getJobTypeBadge } from '../../utils/applicationHelpers';
import ApplicationStatus from './ApplicationStatus';
import SkeletonLoader from '../common/SkeletonLoader';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';

export default function ApplicationTable({
  applications = [],
  total = 0,
  page = 1,
  pageSize = 10,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
}) {
  if (isLoading) {
    return <SkeletonLoader variant="table" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load applications"
        message={error || 'Could not retrieve your application records.'}
        onRetry={onRetry}
      />
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        title="No Applications Found"
        description="No job applications match your current search or filter criteria."
        icon="search"
      />
    );
  }

  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  return (
    <div className="card p-0 overflow-hidden shadow-card border border-surface-200 bg-white">
      {/* Scrollable Table */}
      <div className="table-wrapper border-0 rounded-none">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Company & Role</th>
              <th scope="col">Job Type</th>
              <th scope="col">Location</th>
              <th scope="col">Package (CTC)</th>
              <th scope="col">Applied Date</th>
              <th scope="col">Status</th>
              <th scope="col" className="text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.applicationId}>
                {/* Company & Role */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-surface-100 border border-surface-200 flex items-center justify-center text-primary-600 font-semibold text-xs shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-surface-900 truncate">
                        {app.jobTitle}
                      </p>
                      <p className="text-2xs text-surface-500 font-medium">
                        {app.company}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Job Type */}
                <td>
                  <span className={`badge ${getJobTypeBadge(app.jobType)} text-2xs`}>
                    {app.jobType}
                  </span>
                </td>

                {/* Location */}
                <td>
                  <span className="inline-flex items-center gap-1 text-xs text-surface-600">
                    <MapPin className="w-3.5 h-3.5 text-surface-400" />
                    {app.location || '—'}
                  </span>
                </td>

                {/* CTC */}
                <td>
                  <span className="text-xs font-semibold text-surface-800">
                    {app.ctc || 'As per norms'}
                  </span>
                </td>

                {/* Applied Date */}
                <td>
                  <span className="inline-flex items-center gap-1 text-xs text-surface-600">
                    <Calendar className="w-3.5 h-3.5 text-surface-400" />
                    {formatDate(app.appliedDate)}
                  </span>
                </td>

                {/* Status */}
                <td>
                  <ApplicationStatus status={app.status} size="sm" />
                </td>

                {/* Actions */}
                <td className="text-right">
                  <Link
                    to={buildApplicationDetailsRoute(app.applicationId)}
                    className="btn-ghost px-2.5 py-1 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg inline-flex items-center gap-1 font-semibold"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-surface-50/80 border-t border-surface-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-surface-600">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-surface-900">{startEntry}</strong> to{' '}
            <strong className="text-surface-900">{endEntry}</strong> of{' '}
            <strong className="text-surface-900">{total}</strong> records
          </span>

          {onPageSizeChange && (
            <div className="ml-2 flex items-center gap-1.5">
              <span className="text-2xs text-surface-400">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="select py-0.5 px-2 text-2xs w-auto bg-white border-surface-200"
                aria-label="Rows per page"
              >
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Page Switcher */}
        {totalPages > 1 && onPageChange && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="btn px-2 py-1 bg-white border border-surface-200 text-surface-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`btn px-2.5 py-1 text-xs rounded-lg ${
                    p === page
                      ? 'bg-primary-600 text-white font-bold shadow-2xs'
                      : 'bg-white border border-surface-200 text-surface-700 hover:bg-surface-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="btn px-2 py-1 bg-white border border-surface-200 text-surface-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
