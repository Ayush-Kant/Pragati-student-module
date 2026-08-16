// src/features/student/placement/components/readiness/ReadinessBreakdown.jsx
// Displays weighted category cards with scores, weightings, and trajectory indicators.

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Layers } from 'lucide-react';
import { getScoreColorClass } from '../../utils/placementHelpers';
import { getTrendIndicator } from '../../utils/readinessHelpers';

export default function ReadinessBreakdown({ categories = [] }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-center gap-3 pb-3 mb-4 border-b border-surface-100">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h3 className="section-title text-base">Weighted Pillar Breakdown</h3>
          <p className="text-xs text-surface-500">
            How individual performance areas contribute to your final score
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((item) => {
          const colorStyles = getScoreColorClass(item.score);
          const trend = getTrendIndicator(item.trend);

          return (
            <div
              key={item.category}
              className="p-4 rounded-xl border border-surface-100 bg-surface-50/60 hover:bg-white hover:border-primary-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-surface-900 leading-snug">
                    {item.category}
                  </h4>
                  <span
                    className={`badge px-2 py-0.5 text-2xs font-semibold inline-flex items-center gap-1 ${trend.className}`}
                  >
                    {item.trend === 'improving' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : item.trend === 'declining' ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    {trend.label}
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-2">
                  <span className={`text-2xl font-bold ${colorStyles.text}`}>
                    {item.score}%
                  </span>
                  <span className="text-xs text-surface-400 font-medium">
                    Weight: {(item.weight * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <div className="progress-bar h-2 bg-surface-200">
                  <div
                    className={`progress-fill ${colorStyles.bar}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
