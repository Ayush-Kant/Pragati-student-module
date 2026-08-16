// src/features/student/placement/components/dashboard/CareerOverview.jsx
// Displays a high-level summary of profile, resume, skill, and assessment standing.

import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, FileText, Code2, LineChart, ArrowRight } from 'lucide-react';
import { PLACEMENT_ROUTES } from '../../constants/placementConstants';
import { getResumeStatusBadge, getScoreColorClass } from '../../utils/placementHelpers';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorState from '../common/ErrorState';

export default function CareerOverview({
  profile,
  skills,
  assessments,
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
        title="Overview unavailable"
        message={error || 'Could not fetch career standing metrics.'}
        onRetry={onRetry}
      />
    );
  }

  const profilePct = profile?.completionPercentage ?? 78;
  const resumeStatus = profile?.resume?.status || 'Approved';
  const resumeScore = profile?.resume?.score ?? 82;
  const resumeBadge = getResumeStatusBadge(resumeStatus);
  const skillScore = skills?.overallSkillScore ?? 68;
  const skillColor = getScoreColorClass(skillScore);
  const assessmentScore = assessments?.overallAssessmentScore ?? 74;
  const assessmentColor = getScoreColorClass(assessmentScore);

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="section-title">Career Standing</h3>
          <p className="text-xs text-surface-500">Core employability pillars</p>
        </div>
        <Link
          to={PLACEMENT_ROUTES.CAREER_PROFILE}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 1. Profile Completeness */}
        <div className="p-3.5 rounded-xl border border-surface-100 bg-surface-50/70 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-surface-700">
                Profile Completeness
              </span>
            </div>
            <span className="text-xs font-bold text-indigo-700">
              {profilePct}%
            </span>
          </div>
          <div className="progress-bar h-2 bg-surface-200">
            <div
              className="progress-fill bg-indigo-600"
              style={{ width: `${profilePct}%` }}
            />
          </div>
        </div>

        {/* 2. Resume Quality */}
        <div className="p-3.5 rounded-xl border border-surface-100 bg-surface-50/70 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-surface-700">
                Resume Score
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-700">
              {resumeScore}/100
            </span>
          </div>
          <div className="flex items-center justify-between text-2xs text-surface-500">
            <span>Status:</span>
            <span className={`badge px-2 py-0.2 text-2xs ${resumeBadge.className}`}>
              {resumeBadge.label}
            </span>
          </div>
        </div>

        {/* 3. Skill Readiness */}
        <div className="p-3.5 rounded-xl border border-surface-100 bg-surface-50/70 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-surface-700">
                Skill Match
              </span>
            </div>
            <span className={`text-xs font-bold ${skillColor.text}`}>
              {skillScore}%
            </span>
          </div>
          <div className="progress-bar h-2 bg-surface-200">
            <div
              className={`progress-fill ${skillColor.bar}`}
              style={{ width: `${skillScore}%` }}
            />
          </div>
        </div>

        {/* 4. Assessment Performance */}
        <div className="p-3.5 rounded-xl border border-surface-100 bg-surface-50/70 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                <LineChart className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-surface-700">
                Assessment Avg
              </span>
            </div>
            <span className={`text-xs font-bold ${assessmentColor.text}`}>
              {assessmentScore}%
            </span>
          </div>
          <div className="progress-bar h-2 bg-surface-200">
            <div
              className={`progress-fill ${assessmentColor.bar}`}
              style={{ width: `${assessmentScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
