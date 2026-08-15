// src/features/student/placement/components/assessments/AssessmentSummary.jsx
// Complete presentational component for assessment performance and weekly trends.

import React from 'react';
import { LineChart, Award, CheckCircle2 } from 'lucide-react';
import AptitudeScore from './AptitudeScore';
import TechnicalScore from './TechnicalScore';
import AssessmentTrend from './AssessmentTrend';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';

export default function AssessmentSummary({
  assessmentData,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
}) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader variant="stats" count={1} />
        <SkeletonLoader variant="chart" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load assessment performance"
        message={error || 'Could not fetch your assessment records.'}
        onRetry={onRetry}
      />
    );
  }

  const categories = assessmentData?.categories || [];
  const weeklyTrend = assessmentData?.weeklyTrend || [];
  const overallScore = assessmentData?.overallAssessmentScore ?? null;

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No Assessment Records"
        description="Participate in campus diagnostic tests to establish your baseline assessment performance."
        icon="award"
      />
    );
  }

  // Find specific categories
  const aptitudeCat = categories.find((c) => c.type === 'Aptitude');
  const technicalCat = categories.find((c) => c.type === 'Technical');
  const codingCat = categories.find((c) => c.type === 'Coding');
  const commCat = categories.find((c) => c.type === 'Communication');

  return (
    <div className="space-y-6">
      {/* 1. Header Overview Banner */}
      <div className="card bg-gradient-to-r from-primary-50 via-white to-purple-50/50 border border-primary-100 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="section-title text-lg">Overall Assessment Benchmark</h3>
                {overallScore !== null && (
                  <span className="badge bg-primary-100 text-primary-800 font-bold">
                    {overallScore}% Overall
                  </span>
                )}
              </div>
              <p className="text-xs text-surface-500">
                Aggregated across technical aptitude, coding accuracy, and communication rounds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Eligible for all Tier-1 drives</span>
          </div>
        </div>
      </div>

      {/* 2. Assessment Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {aptitudeCat && <AptitudeScore category={aptitudeCat} />}
        {technicalCat && <TechnicalScore category={technicalCat} />}
        {codingCat && <TechnicalScore category={codingCat} />}
        {commCat && <AptitudeScore category={commCat} />}
      </div>

      {/* 3. Recharts Weekly Progression Trend */}
      <AssessmentTrend trendData={weeklyTrend} />
    </div>
  );
}
