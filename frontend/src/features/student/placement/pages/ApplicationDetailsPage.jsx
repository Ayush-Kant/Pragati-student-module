// src/features/student/placement/pages/ApplicationDetailsPage.jsx
// Detailed single job application view with recruitment timeline and job specifics.

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  FileText,
  Clock,
} from 'lucide-react';
import {
  PLACEMENT_ROUTES,
  QUERY_KEYS,
  STALE_TIME,
} from '../constants/placementConstants';
import { getApplicationById } from '../services/placementService';
import { getJobTypeBadge } from '../utils/applicationHelpers';
import { formatDate } from '../utils/placementHelpers';
import PlacementNavigation from '../components/common/PlacementNavigation';
import ApplicationTimeline from '../components/applications/ApplicationTimeline';
import ApplicationStatus from '../components/applications/ApplicationStatus';
import SkeletonLoader from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

export default function ApplicationDetailsPage() {
  const { applicationId } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.APPLICATION_DETAIL(applicationId),
    queryFn: async () => {
      const res = await getApplicationById(applicationId);
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    enabled: Boolean(applicationId),
    staleTime: STALE_TIME.SHORT,
  });

  return (
    <div className="min-h-screen bg-surface-50">
      <PlacementNavigation />

      <main className="page-container animate-fade-in">
        {/* Back Link */}
        <div className="mb-5">
          <Link
            to={PLACEMENT_ROUTES.JOB_APPLICATIONS}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-surface-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Applications</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="list" />
          </div>
        ) : isError ? (
          <ErrorState
            title="Application Not Found"
            message={error?.message || `Could not find application ${applicationId}`}
            onRetry={refetch}
          />
        ) : !data ? (
          <EmptyState
            title="Application Not Found"
            description="The requested placement record does not exist or has been removed."
            icon="file"
          />
        ) : (
          <div className="space-y-6">
            {/* Header Hero Card */}
            <div className="card shadow-card border-surface-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface-50 border border-surface-200 flex items-center justify-center text-primary-600 font-bold text-lg shrink-0 shadow-xs">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-surface-900">
                        {data.jobTitle}
                      </h2>
                      <ApplicationStatus status={data.status} size="md" />
                    </div>
                    <p className="text-sm font-semibold text-primary-700 mt-0.5">
                      {data.company}
                    </p>
                    <p className="text-xs text-surface-400 font-mono mt-0.5">
                      ID: {data.applicationId}
                    </p>
                  </div>
                </div>

                {/* Key Details Pills */}
                <div className="flex flex-wrap md:flex-col md:items-end gap-2 text-xs">
                  <span className={`badge ${getJobTypeBadge(data.jobType)}`}>
                    {data.jobType}
                  </span>
                  {data.ctc && (
                    <span className="badge bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold inline-flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {data.ctc}
                    </span>
                  )}
                  {data.location && (
                    <span className="badge bg-surface-100 text-surface-700 inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-surface-400" />
                      {data.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Meta information row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-surface-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-surface-400" />
                  <span>Applied On: <strong>{formatDate(data.appliedDate)}</strong></span>
                </div>
                {data.interviewDate && (
                  <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Interview Scheduled: {formatDate(data.interviewDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Two column grid: Timeline & Job Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 cols: Visual Multi-stage Recruitment Timeline */}
              <div className="lg:col-span-2">
                <ApplicationTimeline
                  currentStatus={data.status}
                  timeline={data.timeline}
                />
              </div>

              {/* Right 1 col: Job Description & Placement Cell Guidelines */}
              <div className="space-y-6">
                <div className="card shadow-card">
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-surface-100 text-surface-900 font-semibold text-sm">
                    <Briefcase className="w-4 h-4 text-primary-600" />
                    <span>Role Overview</span>
                  </div>
                  <p className="text-xs text-surface-600 leading-relaxed">
                    {data.jobDescription ||
                      'Participating in full lifecycle software engineering, API development, and automated testing across agile sprint cycles.'}
                  </p>
                </div>

                <div className="card shadow-card bg-indigo-50/40 border border-indigo-100">
                  <div className="flex items-center gap-2 pb-2 mb-2 text-indigo-950 font-semibold text-xs">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Placement Cell Advisory</span>
                  </div>
                  <p className="text-2xs text-indigo-900/80 leading-relaxed">
                    Please ensure you are present 15 minutes prior to scheduled assessment rounds with your institutional ID card and verified resume copy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
