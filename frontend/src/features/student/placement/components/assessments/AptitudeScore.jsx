// src/features/student/placement/components/assessments/AptitudeScore.jsx
// Displays Aptitude assessment metrics with sub-topic breakdowns.

import React from 'react';
import { Brain, Calendar, RotateCcw } from 'lucide-react';
import { getScoreColorClass } from '../../utils/placementHelpers';

export default function AptitudeScore({ category }) {
  if (!category) return null;

  const {
    latestScore = 0,
    average = 0,
    attempts = 0,
    lastAttemptDate,
    breakdown = {},
  } = category;

  const colorStyles = getScoreColorClass(latestScore);

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-start justify-between pb-3 mb-3 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="section-title text-base">General Aptitude</h3>
            <p className="text-xs text-surface-500">Quantitative, logical, and verbal reasoning</p>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-2xl font-bold ${colorStyles.text}`}>
            {latestScore}%
          </span>
          <span className="block text-2xs text-surface-400">Latest</span>
        </div>
      </div>

      {/* Attempts & Averages */}
      <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-lg bg-surface-50 text-xs">
        <div className="flex items-center gap-1.5 text-surface-600">
          <RotateCcw className="w-3.5 h-3.5 text-surface-400" />
          <span>Attempts: <strong>{attempts}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-surface-600">
          <span>Average: <strong>{average}%</strong></span>
        </div>
      </div>

      {/* Sub-breakdown progress bars */}
      <div className="space-y-2.5 pt-1">
        {Object.entries(breakdown).map(([key, val]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-surface-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="font-semibold text-surface-900">{val}%</span>
            </div>
            <div className="progress-bar h-1.5 bg-surface-100">
              <div
                className="progress-fill bg-amber-500"
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {lastAttemptDate && (
        <div className="mt-4 pt-2 border-t border-surface-100 flex items-center gap-1 text-2xs text-surface-400">
          <Calendar className="w-3 h-3" />
          <span>Last attempt: {new Date(lastAttemptDate).toLocaleDateString('en-IN')}</span>
        </div>
      )}
    </div>
  );
}
