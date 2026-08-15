// src/features/student/placement/components/skills/SkillGapAnalysis.jsx
// Displays backend-provided skill gap priorities with current vs target scores and recruiter rationale.
// NOTE: All gap metrics, priorities, and reasons are strictly backend-provided values.

import React from 'react';
import { Target, AlertTriangle, ArrowRight } from 'lucide-react';
import { getPriorityBadge } from '../../utils/readinessHelpers';

export default function SkillGapAnalysis({ skillGaps = [] }) {
  if (!skillGaps || skillGaps.length === 0) {
    return null;
  }

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <h3 className="section-title text-base">Priority Skill Gaps</h3>
          <p className="text-xs text-surface-500">
            Target gaps identified based on your job preference checklist
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {skillGaps.map((item) => {
          const priority = getPriorityBadge(item.priority);

          return (
            <div
              key={item.skillId || item.skillName}
              className="p-4 rounded-xl border border-surface-100 bg-surface-50/70 hover:bg-white hover:border-amber-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-surface-900">
                    {item.skillName}
                  </h4>
                  <span className={`badge px-2.5 py-0.5 text-2xs border ${priority.className}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priority.dot}`} />
                    {priority.label}
                  </span>
                </div>

                <p className="text-xs text-surface-600 leading-relaxed">
                  {item.reason}
                </p>
              </div>

              {/* Score Gap Metric Box */}
              <div className="flex items-center gap-3 shrink-0 p-2.5 rounded-lg bg-white border border-surface-100 shadow-2xs">
                <div className="text-center px-2">
                  <span className="block text-2xs text-surface-400 font-medium">Current</span>
                  <span className="text-sm font-bold text-rose-600">{item.currentScore}%</span>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-surface-400" />

                <div className="text-center px-2">
                  <span className="block text-2xs text-surface-400 font-medium">Target</span>
                  <span className="text-sm font-bold text-emerald-600">{item.targetScore}%</span>
                </div>

                <div className="border-l border-surface-100 pl-2 text-center">
                  <span className="block text-2xs text-surface-400 font-medium">Gap</span>
                  <span className="text-xs font-bold text-amber-700">+{item.gap} pts</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
