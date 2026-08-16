// src/features/student/placement/components/dashboard/ApplicationSummary.jsx
// Displays a preview list of recent job applications with statuses.

import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Building2, MapPin } from 'lucide-react';
import { PLACEMENT_ROUTES, buildApplicationDetailsRoute } from '../../constants/placementConstants';
import { getApplicationStatusBadge } from '../../utils/applicationHelpers';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';

export default function ApplicationSummary({
  applicationsData,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
}) {
  if (isLoading) {
    return <SkeletonLoader variant="list" count={1} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Applications preview unavailable"
        message={error || 'Could not fetch recent applications.'}
        onRetry={onRetry}
      />
    );
  }

  const applications = applicationsData?.applications || [];

  if (applications.length === 0) {
    return (
      <EmptyState
        title="No active applications"
        description="You have not applied to any placement drives yet."
        icon="inbox"
        actionLabel="Explore Drives"
        onAction={() => {}}
      />
    );
  }

  // Display top 4 recent applications
  const recentApps = applications.slice(0, 4);

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="section-title">Recent Applications</h3>
          <p className="text-xs text-surface-500">
            {applicationsData?.total || applications.length} total applications submitted
          </p>
        </div>
        <Link
          to={PLACEMENT_ROUTES.JOB_APPLICATIONS}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {recentApps.map((app) => {
          const badge = getApplicationStatusBadge(app.status);

          return (
            <Link
              key={app.applicationId}
              to={buildApplicationDetailsRoute(app.applicationId)}
              className="group block p-3 rounded-xl border border-surface-100 bg-surface-50/60 hover:bg-white hover:border-primary-200 hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-surface-200 flex items-center justify-center text-primary-600 shadow-2xs shrink-0 group-hover:border-primary-300">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-surface-800 truncate group-hover:text-primary-600 transition-colors">
                      {app.jobTitle}
                    </h4>
                    <div className="flex items-center gap-2 text-2xs text-surface-500 mt-0.5">
                      <span className="font-medium text-surface-700">{app.company}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-surface-400" />
                        {app.location || 'Bangalore'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`badge px-2.5 py-0.5 text-2xs border ${badge.className}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badge.dot}`} />
                    {badge.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-surface-300 group-hover:text-primary-600 transition-colors" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
