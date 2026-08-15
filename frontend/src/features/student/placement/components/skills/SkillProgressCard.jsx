// src/features/student/placement/components/skills/SkillProgressCard.jsx
// Displays single skill metrics with current vs target scores and visual progress.

import React from 'react';
import { getScoreColorClass } from '../../utils/placementHelpers';

export default function SkillProgressCard({ skill }) {
  if (!skill) return null;

  const {
    name = 'Skill',
    currentScore = 0,
    targetScore = 100,
    progress = 0,
    category = 'General',
  } = skill;

  const colorStyles = getScoreColorClass(currentScore);

  return (
    <div className="p-4 rounded-xl border border-surface-200 bg-white hover:border-primary-200 hover:shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h4 className="text-sm font-semibold text-surface-800">{name}</h4>
          <span className="badge bg-surface-100 text-surface-600 text-2xs">
            {category}
          </span>
        </div>

        <div className="flex items-baseline justify-between text-xs text-surface-500 my-2">
          <span>
            Current: <strong className={colorStyles.text}>{currentScore}%</strong>
          </span>
          <span>
            Target: <strong className="text-surface-800">{targetScore}%</strong>
          </span>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        <div className="progress-bar h-2 bg-surface-100">
          <div
            className={`progress-fill ${colorStyles.bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-2xs text-surface-400">
          <span>0%</span>
          <span>{progress}% towards benchmark</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
