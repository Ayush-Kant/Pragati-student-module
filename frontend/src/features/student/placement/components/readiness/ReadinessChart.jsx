// src/features/student/placement/components/readiness/ReadinessChart.jsx
// Visual chart representation of multi-factor readiness scores using Recharts.

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { ShieldCheck } from 'lucide-react';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-white rounded-xl shadow-lg border border-surface-200 text-xs">
        <p className="font-bold text-surface-900 mb-1">{data.category}</p>
        <p className="text-primary-700 font-semibold">
          Score: {data.score}%
        </p>
        <p className="text-surface-500 text-2xs mt-0.5">
          Weight: {(data.weight * 100).toFixed(0)}% of total readiness
        </p>
      </div>
    );
  }
  return null;
}

export default function ReadinessChart({
  categories = [],
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
}) {
  if (isLoading) {
    return <SkeletonLoader variant="chart" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Readiness chart unavailable"
        message={error || 'Could not render category distribution.'}
        onRetry={onRetry}
      />
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        title="No Readiness Data"
        description="Category metrics will populate after taking initial assessments."
        icon="award"
      />
    );
  }

  const getBarColor = (score) => {
    if (score >= 80) return '#10b981'; // emerald
    if (score >= 70) return '#6366f1'; // indigo
    if (score >= 50) return '#f59e0b'; // amber
    return '#f43f5e'; // rose
  };

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="section-title text-base">Category Score Distribution</h3>
            <p className="text-xs text-surface-500">
              Evaluated against corporate placement recruitment standards
            </p>
          </div>
        </div>

        <span className="badge bg-primary-50 text-primary-700 border border-primary-200 text-xs">
          Multi-Pillar
        </span>
      </div>

      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categories}
            margin={{ top: 10, right: 15, left: -20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
