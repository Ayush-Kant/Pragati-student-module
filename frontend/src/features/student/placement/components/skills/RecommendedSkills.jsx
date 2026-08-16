// src/features/student/placement/components/skills/RecommendedSkills.jsx
// Displays curated skill recommendations with direct learning documentation links.

import React from 'react';
import { Lightbulb, ExternalLink, BookOpen } from 'lucide-react';

export default function RecommendedSkills({ recommendedSkills = [] }) {
  if (!recommendedSkills || recommendedSkills.length === 0) {
    return null;
  }

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-200">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h3 className="section-title text-base">Recommended Skills to Acquire</h3>
          <p className="text-xs text-surface-500">
            High-demand capabilities among companies hiring from your batch
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {recommendedSkills.map((skill) => (
          <div
            key={skill.id || skill.name}
            className="p-4 rounded-xl border border-surface-100 bg-surface-50/60 hover:bg-white hover:border-primary-200 hover:shadow-2xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="text-sm font-semibold text-surface-900">{skill.name}</h4>
                <BookOpen className="w-3.5 h-3.5 text-primary-500" />
              </div>
              <p className="text-xs text-surface-600 leading-relaxed mb-3">
                {skill.reason}
              </p>
            </div>

            {skill.resourceUrl && (
              <a
                href={skill.resourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors pt-2 border-t border-surface-100"
              >
                <span>Study Resources</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
