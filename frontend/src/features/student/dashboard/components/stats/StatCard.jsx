import React from 'react';

function StatCard({ title, value, icon, description }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-between shadow-sm hover:border-gray-700 transition-all">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-gray-500">
            {description}
          </p>
        )}
      </div>
      <div className="text-3xl bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
        {icon}
      </div>
    </div>
  );
}

export default StatCard;