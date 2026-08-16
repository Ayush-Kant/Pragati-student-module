// src/features/student/placement/components/skills/SkillReadiness.jsx
// Complete presentational component for technical skills readiness & gap analysis.

import React, { useState, useMemo } from 'react';
import { Code2, Filter } from 'lucide-react';
import SkillProgressCard from './SkillProgressCard';
import SkillGapAnalysis from './SkillGapAnalysis';
import RecommendedSkills from './RecommendedSkills';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';

export default function SkillReadiness({
  skillData,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const skills = skillData?.skills || [];
  const skillGapAnalysis = skillData?.skillGapAnalysis || [];
  const recommendedSkills = skillData?.recommendedSkills || [];
  const overallSkillScore = skillData?.overallSkillScore ?? null;

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set(['All']);
    skills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [skills]);

  // Filter skills by selected category
  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'All') return skills;
    return skills.filter((s) => s.category === selectedCategory);
  }, [skills, selectedCategory]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader variant="card" count={2} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load skill readiness"
        message={error || 'Could not fetch skill benchmark data.'}
        onRetry={onRetry}
      />
    );
  }

  if (skills.length === 0) {
    return (
      <EmptyState
        title="No Verified Skills"
        description="Take your technical skill assessments to generate your skill benchmark data."
        icon="award"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Skill Breakdown Grid */}
      <div className="card shadow-card hover:shadow-card-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="section-title text-base lg:text-lg">Skill Benchmark Grid</h3>
                {overallSkillScore !== null && (
                  <span className="badge bg-blue-50 text-blue-700 border border-blue-200 text-xs">
                    Avg: {overallSkillScore}%
                  </span>
                )}
              </div>
              <p className="text-xs text-surface-500">
                Verified proficiencies evaluated against role requirements
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            <Filter className="w-3.5 h-3.5 text-surface-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skill cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <SkillProgressCard key={skill.id || skill.name} skill={skill} />
          ))}
        </div>
      </div>

      {/* 2. Priority Skill Gaps (Backend Provided) */}
      <SkillGapAnalysis skillGaps={skillGapAnalysis} />

      {/* 3. Recommended Next Skills */}
      <RecommendedSkills recommendedSkills={recommendedSkills} />
    </div>
  );
}
