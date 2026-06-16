import React from 'react';
import { useNavigate } from 'react-router-dom';
import { quickActions } from '../../types/dashboardDummyData';
import { validateQuickAction } from '../../validations/dashboardValidation';
import { QUICK_ACTIONS_TITLE } from '../../constants/dashboardConstants';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-4">
        {QUICK_ACTIONS_TITLE}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {quickActions
          .filter(validateQuickAction)
          .map((action) => (
            <button
              key={action.id}
              onClick={() => navigate(action.route)}
              className="border rounded-md p-3 hover:bg-gray-100"
            >
              {action.title}
            </button>
          ))}
      </div>
    </div>
  );
}