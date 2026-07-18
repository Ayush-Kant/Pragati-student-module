import React from 'react';
import * as Icons from 'lucide-react';
import { QUICK_ACTIONS } from '../../constants/dashboardConstants';

export const QuickActions = ({ onActionTrigger }) => {
  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
        Quick System Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action) => {
          const IconComponent = Icons[action.icon] || Icons.HelpCircle;
          return (
            <button
              key={action.id}
              onClick={() => onActionTrigger && onActionTrigger(action.id)}
              className="glass-card glass-card-hover p-4 rounded-xl flex items-center gap-4 text-left border border-white/5 w-full relative overflow-hidden group active:scale-[0.98]"
            >
              {/* Highlight icon bg on hover */}
              <div className="p-3 rounded-lg bg-indigo-500/10 text-neon-indigo border border-indigo-500/20 group-hover:bg-neon-indigo group-hover:text-white group-hover:shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all duration-300">
                <IconComponent className="w-5 h-5" />
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                  {action.label}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
