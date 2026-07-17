import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EmptyState } from '../common/EmptyState';

export const HiringTrendChart = ({ data = [] }) => {
  if (!data || data.length === 0) return <EmptyState message="No hiring history tracked." />;
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 h-64 shadow-xs">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hiring Trajectory</h4>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} stroke="#9CA3AF" />
          <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="#9CA3AF" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '11px' }} />
          <Line type="monotone" dataKey="placed" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};