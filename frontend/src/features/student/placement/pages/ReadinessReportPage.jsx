// src/features/student/placement/pages/ReadinessReportPage.jsx
// Comprehensive placement readiness diagnostic report page.

import React from 'react';
import { Award, ShieldCheck, RefreshCw, Calendar } from 'lucide-react';
import PlacementNavigation from '../components/common/PlacementNavigation';
import ReadinessBreakdown from '../components/readiness/ReadinessBreakdown';
import ReadinessChart from '../components/readiness/ReadinessChart';
import ImprovementAreas from '../components/readiness/ImprovementAreas';
import CareerRecommendations from '../components/readiness/CareerRecommendations';
import SkeletonLoader from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { getScoreColorClass, getScoreLabel, formatDate } from '../utils/placementHelpers';
import { useReadinessReport } from '../hooks/useReadinessReport';

export default function ReadinessReportPage() {
  const {
    report,
    categories,
    improvementAreas,
    recommendations,
    overallScore,
    generatedAt,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useReadinessReport();

  const colorStyles = overallScore !== null ? getScoreColorClass(overallScore) : null;
  const label = overallScore !== null ? getScoreLabel(overallScore) : '';

  return (
    <div className="min-h-screen bg-surface-50">
      <PlacementNavigation />

      <main className="page-container animate-fade-in">
        <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="page-title">Placement Readiness Report</h2>
            <p className="page-description">
              Multi-factor diagnostic evaluation benchmarked against campus drive criteria.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {generatedAt && (
              <span className="inline-flex items-center gap-1 text-xs text-surface-400">
                <Calendar className="w-3.5 h-3.5" />
                Updated: {formatDate(generatedAt)}
              </span>
            )}
            <button
              type="button"
              onClick={refetch}
              disabled={isFetching}
              className="btn px-3 py-1.5 bg-white border border-surface-200 text-surface-700 hover:bg-surface-100 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              <span>Refresh Report</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="chart" />
            <SkeletonLoader variant="list" count={2} />
          </div>
        ) : isError ? (
          <ErrorState
            title="Readiness Report Unavailable"
            message={error || 'Could not load your diagnostic readiness report.'}
            onRetry={refetch}
          />
        ) : !report ? (
          <EmptyState
            title="No Readiness Data"
            description="Complete the baseline technical assessments and profile steps to generate your readiness analysis."
            icon="award"
          />
        ) : (
          <div className="space-y-6">
            {/* 1. Overall Score Highlight Banner */}
            <div className="card bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 text-white border-0 shadow-card-lg p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-white/10 text-primary-200 border border-white/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-300" />
                    Verified Placement Index
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Overall Placement Readiness
                  </h3>
                  <p className="text-xs sm:text-sm text-primary-200 max-w-xl">
                    Your composite score synthesizes verified technical skills, coding benchmarks, academic CGPA, and resume strength into a single employability index.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shrink-0">
                  <div className="text-center">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {overallScore}%
                    </span>
                    <span className="block text-2xs font-bold text-primary-200 uppercase tracking-widest mt-0.5">
                      Composite Score
                    </span>
                  </div>
                  <div className="border-l border-white/20 pl-4 space-y-1 text-left">
                    <span className="badge bg-emerald-400/20 text-emerald-300 border border-emerald-300/30 text-xs font-bold">
                      {label}
                    </span>
                    <p className="text-2xs text-primary-200">
                      Tier-1 Eligible
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Visual Distribution Chart & Weighted Pillar Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReadinessChart categories={categories} />
              <ReadinessBreakdown categories={categories} />
            </div>

            {/* 3. Priority Improvement Targets */}
            <ImprovementAreas improvementAreas={improvementAreas} />

            {/* 4. Actionable Career Recommendations */}
            <CareerRecommendations recommendations={recommendations} />
          </div>
        )}
      </main>
    </div>
  );
}
