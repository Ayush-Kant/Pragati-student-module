// src/features/student/placement/components/dashboard/ReadinessScoreCard.jsx
// Displays authoritative backend-provided readiness score with circular ring and tier badge.

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PLACEMENT_ROUTES } from '../../constants/placementConstants';
import { getScoreColorClass, getScoreLabel } from '../../utils/placementHelpers';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';

export default function ReadinessScoreCard({
  score,
  lastUpdated,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
}) {
  if (isLoading) {
    return <SkeletonLoader variant="card" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load readiness score"
        message={error || 'Could not fetch your overall score.'}
        onRetry={onRetry}
      />
    );
  }

  if (score === null || score === undefined) {
    return (
      <EmptyState
        title="No Readiness Score"
        description="Complete your initial assessment to generate your placement readiness score."
        icon="award"
      />
    );
  }

  const colorStyles = getScoreColorClass(score);
  const label = getScoreLabel(score);

  // SVG Circular progress ring calculations (radius = 48, circumference = 2 * PI * 48 = 301.6)
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="card relative overflow-hidden bg-gradient-to-br from-white via-white to-primary-50/30 border border-primary-100/80 shadow-card hover:shadow-card-md transition-shadow">
      {/* Subtle top decoration */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 to-accent-500" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100/60 text-primary-700 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            Placement Readiness
          </div>
          <h3 className="section-title">Career Readiness Score</h3>
          <p className="text-xs text-surface-500">
            Authoritative assessment benchmark
          </p>
        </div>

        <span
          className={`badge px-3 py-1 text-xs font-semibold border ${colorStyles.badge}`}
        >
          {label}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-4 p-4 rounded-2xl bg-surface-50/80 border border-surface-100">
        {/* SVG Circular score visual */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-surface-200"
            />
            {/* Animated progress ring */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={colorStyles.ring}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score Number */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-extrabold tracking-tight ${colorStyles.text}`}>
              {score}%
            </span>
            <span className="text-2xs font-medium text-surface-400 uppercase tracking-wider">
              Score
            </span>
          </div>
        </div>

        {/* Breakdown highlight text */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start text-xs font-medium text-surface-700">
            <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
            <span>Multi-factor benchmark</span>
          </div>
          <p className="text-xs text-surface-500 leading-relaxed">
            Derived from your academic CGPA, verified skill benchmarks, coding assessments, and profile completeness.
          </p>
          {lastUpdated && (
            <p className="text-2xs text-surface-400">
              Evaluated {new Date(lastUpdated).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-surface-100 mt-2">
        <span className="text-xs text-surface-500">
          Target: <strong className="text-surface-800">85%+</strong> for tier-1 roles
        </span>
        <Link
          to={PLACEMENT_ROUTES.READINESS_REPORT}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          View Full Breakdown
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
