// src/features/student/placement/components/readiness/ImprovementAreas.jsx
// Displays diagnostic improvement targets with concrete action items.

import React from 'react';
import { Target, CheckSquare, ArrowRight } from 'lucide-react';
import { getPriorityBadge } from '../../utils/readinessHelpers';

export default function ImprovementAreas({ improvementAreas = [] }) {
  if (!improvementAreas || improvementAreas.length === 0) {
    return null;
  }

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-center gap-3 pb-3 mb-4 border-b border-surface-100">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="section-title text-base">Key Improvement Areas</h3>
          <p className="text-xs text-surface-500">
            Actionable targets to elevate your composite readiness tier
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {improvementAreas.map((area) => {
          const priority = getPriorityBadge(area.priority);

          return (
            <div
              key={area.id || area.area}
              className="p-4 rounded-xl border border-surface-100 bg-surface-50/60 hover:bg-white hover:border-amber-200 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-surface-900">{area.area}</h4>
                  <span className={`badge px-2.5 py-0.5 text-2xs border ${priority.className}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priority.dot}`} />
                    {priority.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-surface-500">Current: <span className="text-rose-600">{area.currentScore}%</span></span>
                  <ArrowRight className="w-3.5 h-3.5 text-surface-400" />
                  <span className="text-surface-500">Target: <span className="text-emerald-600">{area.targetScore}%</span></span>
                </div>
              </div>

              {/* Action checklist items */}
              {area.actions && area.actions.length > 0 && (
                <div className="space-y-1.5 mt-2 pt-2 border-t border-surface-100">
                  <span className="text-2xs font-semibold text-surface-500 uppercase tracking-wider">
                    Recommended Action Steps:
                  </span>
                  <ul className="space-y-1">
                    {area.actions.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-surface-700">
                        <CheckSquare className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
