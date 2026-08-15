// src/features/student/placement/components/assessments/AssessmentTrend.jsx
// Weekly performance trend chart rendered with Recharts.
// Fully responsive with loading, empty, and error states built-in.

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';

// Custom tooltip renderer for Recharts
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white rounded-xl shadow-lg border border-surface-200 text-xs">
        <p className="font-bold text-surface-900 mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-surface-600 capitalize">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-bold text-surface-900">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function AssessmentTrend({
  trendData = [],
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
        title="Assessment trend unavailable"
        message={error || 'Could not load historical performance chart.'}
        onRetry={onRetry}
      />
    );
  }

  if (!trendData || trendData.length === 0) {
    return (
      <EmptyState
        title="No Assessment Trend"
        description="Attempt multiple assessments across weeks to visualize your progress curve."
        icon="alert"
      />
    );
  }

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="section-title text-base">Weekly Assessment Trajectory</h3>
            <p className="text-xs text-surface-500">
              Progression curve over the last 8 assessment cycles
            </p>
          </div>
        </div>

        <span className="badge bg-purple-50 text-purple-700 border border-purple-200 text-xs">
          Weekly Trend
        </span>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              domain={[40, 100]}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
              iconType="circle"
            />

            <Line
              type="monotone"
              dataKey="coding"
              name="Coding"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#6366f1' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="technical"
              name="Technical"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="aptitude"
              name="Aptitude"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f59e0b' }}
            />
            <Line
              type="monotone"
              dataKey="communication"
              name="Communication"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
