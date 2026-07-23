import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EmptyState } from '../common/EmptyState';

export const PackageDistributionChart = ({ data = [] }) => {
  if (!data || data.length === 0) return <EmptyState message="No package metrics logs found." />;
  const COLORS = ['#4F46E5', '#06B6D4', '#F59E0B', '#10B981'];
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 h-64 shadow-xs">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Package Spans</h4>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} cx="50%" cy="45%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="count" nameKey="range">
            {data.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};