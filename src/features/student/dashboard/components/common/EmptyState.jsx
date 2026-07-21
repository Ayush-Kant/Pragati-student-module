import React from 'react';
import * as Icons from 'lucide-react';

export const EmptyState = ({ 
  iconName = 'Inbox', 
  title = 'No data available', 
  message = 'There is currently no information to display here.',
  actionLabel,
  onActionClick
}) => {
  const IconComponent = Icons[iconName] || Icons.Inbox;

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl glass-card text-center w-full min-h-[200px]">
      <div className="p-4 rounded-full bg-slate-800/50 border border-space-border mb-4 text-gray-500">
        <IconComponent className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-gray-200 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-xs mb-4">{message}</p>
      
      {actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet hover:from-neon-violet hover:to-neon-indigo text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
