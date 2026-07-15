import React from 'react';

function TaskCard({ title, deadline, priority }) {
  // JavaScript logic to dynamically style the priority badge
  const getPriorityStyles = (prio) => {
    switch (prio?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800/80 rounded-lg p-4 flex items-center justify-between hover:bg-gray-900 transition-colors">
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-gray-200">{title}</h4>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          ⏳ {deadline}
        </p>
      </div>
      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getPriorityStyles(priority)}`}>
        {priority}
      </span>
    </div>
  );
}

export default TaskCard;