// src/features/student/placement/components/applications/ApplicationTimeline.jsx
// Visual recruitment stage pipeline rendered strictly from backend timestamps and statuses.
// Visual progression: ✓ (Completed) / ● (Active current stage) / ○ (Pending)

import React from 'react';
import {
  Check,
  CircleDot,
  Circle,
  XCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_ORDER,
} from '../../constants/placementConstants';
import { getTimelineStepState, getApplicationStatusBadge } from '../../utils/applicationHelpers';
import { formatDateTime } from '../../utils/placementHelpers';

export default function ApplicationTimeline({
  currentStatus = APPLICATION_STATUS.APPLIED,
  timeline = [],
}) {
  const isRejected = currentStatus === APPLICATION_STATUS.REJECTED;
  const isWithdrawn = currentStatus === APPLICATION_STATUS.WITHDRAWN;
  const statusBadge = getApplicationStatusBadge(currentStatus);

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-100">
        <div>
          <h3 className="section-title text-base lg:text-lg">Application Timeline</h3>
          <p className="text-xs text-surface-500">
            Recorded milestones and stage progression from recruiter updates
          </p>
        </div>

        <span className={`badge px-3 py-1 text-xs border ${statusBadge.className}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusBadge.dot}`} />
          {statusBadge.label}
        </span>
      </div>

      {/* Vertical Step Progression List */}
      <div className="relative pl-6 sm:pl-8 space-y-6">
        {/* Continuous background vertical line */}
        <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-surface-200" />

        {APPLICATION_STATUS_ORDER.map((stageName, index) => {
          const { state, entry } = getTimelineStepState(stageName, currentStatus, timeline);

          const isCompleted = state === 'completed';
          const isActive = state === 'active';
          const isPending = state === 'pending';

          return (
            <div key={stageName} className="relative flex items-start gap-4">
              {/* Step Icon Indicator */}
              <div className="absolute -left-6 sm:-left-8 mt-0.5">
                {isCompleted ? (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                ) : isActive ? (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs ring-4 ring-indigo-100 animate-pulse">
                    <CircleDot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                ) : (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-surface-300 text-surface-300 flex items-center justify-center">
                    <Circle className="w-2.5 h-2.5 fill-current" />
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4
                    className={`text-sm font-semibold ${
                      isCompleted || isActive ? 'text-surface-900' : 'text-surface-400'
                    }`}
                  >
                    {stageName}
                  </h4>

                  {entry?.date && (
                    <span className="inline-flex items-center gap-1 text-2xs text-surface-400 font-medium">
                      <Calendar className="w-3 h-3" />
                      {formatDateTime(entry.date)}
                    </span>
                  )}
                </div>

                {entry?.note && (
                  <p className="text-xs text-surface-600 mt-1 leading-relaxed bg-surface-50 p-2.5 rounded-lg border border-surface-100">
                    {entry.note}
                  </p>
                )}

                {isActive && !entry?.note && (
                  <p className="text-xs text-indigo-700 font-medium mt-0.5">
                    Currently in progress. Awaiting feedback from placement cell.
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Special Terminal States: Rejected or Withdrawn */}
        {isRejected && (
          <div className="relative flex items-start gap-4 pt-2">
            <div className="absolute -left-6 sm:-left-8 mt-0.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900">
              <h4 className="font-semibold text-rose-950 mb-0.5">Application Closed (Rejected)</h4>
              <p className="text-rose-800">
                {timeline.find((t) => t.stage === APPLICATION_STATUS.REJECTED)?.note ||
                  'The candidate did not meet the screening threshold for this round.'}
              </p>
            </div>
          </div>
        )}

        {isWithdrawn && (
          <div className="relative flex items-start gap-4 pt-2">
            <div className="absolute -left-6 sm:-left-8 mt-0.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
              <h4 className="font-semibold text-amber-950 mb-0.5">Application Withdrawn</h4>
              <p className="text-amber-800">
                {timeline.find((t) => t.stage === APPLICATION_STATUS.WITHDRAWN)?.note ||
                  'The candidate withdrew this application.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
