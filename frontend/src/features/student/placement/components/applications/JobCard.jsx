// src/features/student/placement/components/applications/JobCard.jsx
// Responsive card representation of a single job application.

import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { buildApplicationDetailsRoute } from '../../constants/placementConstants';
import { getJobTypeBadge } from '../../utils/applicationHelpers';
import { formatDate } from '../../utils/placementHelpers';
import ApplicationStatus from './ApplicationStatus';

export default function JobCard({ application }) {
  if (!application) return null;

  const {
    applicationId,
    company,
    jobTitle,
    jobType,
    location,
    ctc,
    appliedDate,
    status,
    interviewDate,
  } = application;

  const jobTypeBadge = getJobTypeBadge(jobType);

  return (
    <div className="card p-5 shadow-card hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between border border-surface-200/80 bg-white">
      <div>
        {/* Header: Company & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-surface-50 border border-surface-200 flex items-center justify-center text-primary-600 font-bold shrink-0 shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-surface-900 truncate" title={jobTitle}>
                {jobTitle}
              </h3>
              <p className="text-xs font-semibold text-primary-700 truncate">
                {company}
              </p>
            </div>
          </div>

          <ApplicationStatus status={status} size="sm" />
        </div>

        {/* Badges / Meta row */}
        <div className="flex flex-wrap gap-2 my-3 text-xs">
          <span className={`badge ${jobTypeBadge} font-medium`}>
            {jobType}
          </span>
          {ctc && (
            <span className="badge bg-surface-100 text-surface-700 font-medium inline-flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-surface-400" />
              {ctc}
            </span>
          )}
          {location && (
            <span className="badge bg-surface-100 text-surface-700 font-medium inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-surface-400" />
              {location}
            </span>
          )}
        </div>
      </div>

      {/* Footer / Dates & Link */}
      <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between text-xs">
        <div className="text-surface-400 text-2xs space-y-0.5">
          <div className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Applied: {formatDate(appliedDate)}</span>
          </div>
          {interviewDate && (
            <div className="text-indigo-600 font-semibold">
              Interview: {formatDate(interviewDate)}
            </div>
          )}
        </div>

        <Link
          to={buildApplicationDetailsRoute(applicationId)}
          className="btn-ghost px-2.5 py-1 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 inline-flex items-center gap-1 font-semibold rounded-lg"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
