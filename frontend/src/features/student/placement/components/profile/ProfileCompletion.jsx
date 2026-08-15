// src/features/student/placement/components/profile/ProfileCompletion.jsx
// Displays profile completeness percentage, status tier, and direct links to fill incomplete sections.

import React from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import {
  PROFILE_SECTION_LABEL,
  PROFILE_SECTION,
} from '../../constants/placementConstants';
import { getProfileCompletionStatus } from '../../utils/placementHelpers';

export default function ProfileCompletion({
  completionPercentage = 78,
  incompleteSections = [],
  onNavigateSection,
}) {
  const statusInfo = getProfileCompletionStatus(completionPercentage);

  const handleSectionClick = (sectionKey) => {
    if (onNavigateSection) {
      onNavigateSection(sectionKey);
    } else {
      const el = document.getElementById(sectionKey);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="card bg-gradient-to-br from-white via-indigo-50/20 to-primary-50/40 border border-primary-100 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-primary-100 text-primary-700 mb-1">
            <Award className="w-3 h-3 text-primary-600" />
            Recruiter Visibility
          </div>
          <h3 className="section-title">Profile Completion</h3>
          <p className="text-xs text-surface-500">
            Complete profiles receive 3.5x more recruiter shortlists
          </p>
        </div>

        <div className="text-right sm:shrink-0">
          <span className="text-3xl font-extrabold text-primary-700">
            {completionPercentage}%
          </span>
          <span className="block text-2xs font-semibold text-surface-500 uppercase tracking-wider">
            {statusInfo.status}
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full bg-surface-200/80 rounded-full h-3 mb-5 overflow-hidden p-0.5 border border-surface-200">
        <div
          className={`h-full rounded-full ${statusInfo.bg} transition-all duration-1000 ease-out shadow-xs`}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Incomplete sections callout */}
      {incompleteSections.length > 0 ? (
        <div className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 mb-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Complete these sections to reach 100%:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {incompleteSections.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => handleSectionClick(sec)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-surface-50 hover:bg-primary-50/70 border border-surface-100 hover:border-primary-200 text-left transition-all text-xs group"
              >
                <span className="font-medium text-surface-700 group-hover:text-primary-700">
                  {PROFILE_SECTION_LABEL[sec] || sec}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-surface-400 group-hover:text-primary-600 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your profile is fully completed and optimized for campus placement drives!</span>
        </div>
      )}
    </div>
  );
}
