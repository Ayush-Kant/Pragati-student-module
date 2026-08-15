// src/features/student/placement/components/dashboard/PlacementProgress.jsx
// Displays placement pipeline status milestones and stage counts.

import React from 'react';
import { Send, Award, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';

export default function PlacementProgress({
  overview,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
}) {
  if (isLoading) {
    return <SkeletonLoader variant="stats" count={1} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Placement status unavailable"
        message={error || 'Could not load pipeline progress.'}
        onRetry={onRetry}
      />
    );
  }

  if (!overview) {
    return (
      <EmptyState
        title="No Placement Progress"
        description="Your placement cycle progress will appear here once you begin applying."
      />
    );
  }

  const {
    placementStatus = 'In Progress',
    totalApplications = 0,
    shortlisted = 0,
    interviews = 0,
    offers = 0,
  } = overview;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const metrics = [
    {
      label: 'Applications',
      count: totalApplications,
      icon: Send,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
      border: 'border-primary-100',
    },
    {
      label: 'Shortlisted',
      count: shortlisted,
      icon: Award,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Interviews',
      count: interviews,
      icon: Calendar,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'Offers',
      count: offers,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
  ];

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="section-title">Placement Pipeline</h3>
          <p className="text-xs text-surface-500">Live recruitment progress</p>
        </div>
        <span className={`badge px-2.5 py-1 text-xs font-semibold border ${getStatusBadge(placementStatus)}`}>
          {placementStatus}
        </span>
      </div>

      {/* Grid of pipeline milestones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`p-3.5 rounded-xl border ${item.border} ${item.bg} flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-150`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-surface-600">
                  {item.label}
                </span>
                <div className={`p-1.5 rounded-lg bg-white shadow-xs ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-bold text-surface-900">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between text-xs text-surface-500">
        <span className="inline-flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-primary-600" />
          Active placement drive: <strong>2024–2025 Cycle</strong>
        </span>
      </div>
    </div>
  );
}
