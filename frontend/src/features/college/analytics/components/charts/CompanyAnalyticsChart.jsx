import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EmptyState } from '../common/EmptyState';

export const CompanyAnalyticsChart = ({ data = [] }) => {
  if (!data || data.length === 0) return <EmptyState message="No company metrics logged." />;
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 h-64 shadow-xs">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Company Placements</h4>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
          <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} stroke="#9CA3AF" />
          <YAxis dataKey="company" type="category" fontSize={10} tickLine={false} axisLine={false} stroke="#9CA3AF" width={70} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '11px' }} />
          <Bar dataKey="offers" fill="#10B981" radius={[0, 4, 4, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};