// src/features/student/placement/pages/PlacementDashboardPage.jsx
// ⚠️  RESERVED FILE — Owned exclusively by @team-lead.
//     Draft copy proposed in: _review/PlacementDashboardPage.proposed.jsx
//     This file provides the working dev dashboard rendering the partial-failure pattern.

import React from 'react';
import PlacementNavigation from '../components/common/PlacementNavigation';
import ReadinessScoreCard from '../components/dashboard/ReadinessScoreCard';
import PlacementProgress from '../components/dashboard/PlacementProgress';
import ApplicationSummary from '../components/dashboard/ApplicationSummary';
import CareerOverview from '../components/dashboard/CareerOverview';
import SkillReadiness from '../components/skills/SkillReadiness';
import AssessmentSummary from '../components/assessments/AssessmentSummary';
import CareerRecommendations from '../components/readiness/CareerRecommendations';
import ErrorState from '../components/common/ErrorState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { usePlacementDashboard } from '../hooks/usePlacementDashboard';

export default function PlacementDashboardPage() {
  const {
    isInitialLoading,
    overview,
    skills,
    assessments,
    applications,
    recommendations,
    profile,
  } = usePlacementDashboard();

  return (
    <div className="min-h-screen bg-surface-50">
      <PlacementNavigation />

      <main className="page-container animate-fade-in space-y-6">
        {/* Page Header */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="page-title">Student Placement Dashboard</h2>
            <p className="page-description">
              Live tracking for campus recruitment drives, verified skill benchmarks, and diagnostic readiness.
            </p>
          </div>
        </div>

        {/* Global Loading state when everything is loading simultaneously */}
        {isInitialLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <SkeletonLoader variant="card" />
              <SkeletonLoader variant="stats" />
              <SkeletonLoader variant="card" />
            </div>
            <SkeletonLoader variant="chart" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Grid: Readiness Score, Placement Pipeline, Career Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
              {/* 1. Readiness Score Card (Independent Failure Boundary) */}
              <div className="lg:col-span-1">
                {overview.isError ? (
                  <ErrorState
                    title="Readiness score unavailable"
                    message={overview.error?.message || 'Failed to load readiness index.'}
                    onRetry={overview.refetch}
                  />
                ) : (
                  <ReadinessScoreCard
                    score={overview.data?.overallReadinessScore}
                    lastUpdated={overview.data?.lastUpdated}
                    isLoading={overview.isLoading}
                    isError={overview.isError}
                    error={overview.error?.message}
                    onRetry={overview.refetch}
                  />
                )}
              </div>

              {/* 2. Placement Pipeline Progress (Independent Failure Boundary) */}
              <div className="lg:col-span-2">
                {overview.isError ? (
                  <ErrorState
                    title="Placement pipeline unavailable"
                    message={overview.error?.message || 'Failed to load milestone counts.'}
                    onRetry={overview.refetch}
                  />
                ) : (
                  <PlacementProgress
                    overview={overview.data}
                    isLoading={overview.isLoading}
                    isError={overview.isError}
                    error={overview.error?.message}
                    onRetry={overview.refetch}
                  />
                )}
              </div>
            </div>

            {/* Middle Grid: Applications Summary & Career Standing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              {/* 3. Recent Applications Summary (Independent Failure Boundary) */}
              <div>
                {applications.isError ? (
                  <ErrorState
                    title="Applications unavailable"
                    message={applications.error?.message || 'Could not fetch applications.'}
                    onRetry={applications.refetch}
                  />
                ) : (
                  <ApplicationSummary
                    applicationsData={applications.data}
                    isLoading={applications.isLoading}
                    isError={applications.isError}
                    error={applications.error?.message}
                    onRetry={applications.refetch}
                  />
                )}
              </div>

              {/* 4. Career Standing Metrics (Independent Failure Boundary) */}
              <div>
                {profile.isError && skills.isError ? (
                  <ErrorState
                    title="Career standing unavailable"
                    message="Could not load career standing overview."
                    onRetry={() => {
                      profile.refetch();
                      skills.refetch();
                    }}
                  />
                ) : (
                  <CareerOverview
                    profile={profile.data}
                    skills={skills.data}
                    assessments={assessments.data}
                    isLoading={profile.isLoading || skills.isLoading}
                    isError={false}
                    onRetry={() => {
                      profile.refetch();
                      skills.refetch();
                    }}
                  />
                )}
              </div>
            </div>

            {/* 5. Assessments Performance & Trend Chart (Independent Failure Boundary) */}
            <section aria-labelledby="assessments-heading">
              <div className="mb-3">
                <h3 id="assessments-heading" className="text-base font-bold text-surface-900">
                  Assessment Performance & Diagnostic Trends
                </h3>
              </div>
              {assessments.isError ? (
                <ErrorState
                  title="Assessments section unavailable"
                  message={assessments.error?.message || 'Diagnostic assessment metrics failed to load.'}
                  onRetry={assessments.refetch}
                />
              ) : (
                <AssessmentSummary
                  assessmentData={assessments.data}
                  isLoading={assessments.isLoading}
                  isError={assessments.isError}
                  error={assessments.error?.message}
                  onRetry={assessments.refetch}
                />
              )}
            </section>

            {/* 6. Skills Readiness & Gap Benchmark (Independent Failure Boundary) */}
            <section aria-labelledby="skills-heading">
              <div className="mb-3">
                <h3 id="skills-heading" className="text-base font-bold text-surface-900">
                  Technical Skill Benchmarks
                </h3>
              </div>
              {skills.isError ? (
                <ErrorState
                  title="Skills section unavailable"
                  message={skills.error?.message || 'Technical skill proficiencies failed to load.'}
                  onRetry={skills.refetch}
                />
              ) : (
                <SkillReadiness
                  skillData={skills.data}
                  isLoading={skills.isLoading}
                  isError={skills.isError}
                  error={skills.error?.message}
                  onRetry={skills.refetch}
                />
              )}
            </section>

            {/* 7. Actionable Career Recommendations (Independent Failure Boundary) */}
            <section aria-labelledby="recommendations-heading">
              <div className="mb-3">
                <h3 id="recommendations-heading" className="text-base font-bold text-surface-900">
                  Target Recommendations
                </h3>
              </div>
              {recommendations.isError ? (
                <ErrorState
                  title="Recommendations unavailable"
                  message={recommendations.error?.message || 'Could not fetch personalized recommendations.'}
                  onRetry={recommendations.refetch}
                />
              ) : (
                <CareerRecommendations
                  recommendations={recommendations.data}
                  isLoading={recommendations.isLoading}
                  isError={recommendations.isError}
                  error={recommendations.error?.message}
                  onRetry={recommendations.refetch}
                />
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
