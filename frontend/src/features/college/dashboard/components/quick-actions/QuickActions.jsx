import React from 'react';
import { quickActions } from '../../types/dashboardDummyData';

export default function QuickActions() {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            className="border rounded-md p-3 hover:bg-gray-100"
          >
            {action.title}
          </button>
        ))}
      </div>
    </div>
  );
}