import React from 'react';

const ICONS = {
  assignment: { icon: '📝', color: 'bg-red-100 text-red-600' },
  quiz: { icon: '❓', color: 'bg-green-100 text-green-600' },
  case_study: { icon: '📚', color: 'bg-purple-100 text-purple-600' },
  coding: { icon: '💻', color: 'bg-blue-100 text-blue-600' },
};

const STATUS_STYLES = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    draft: 'bg-gray-100 text-gray-800',
};

const formatDate = (dateString) => {
    if (!dateString) return 'No Deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};


const ActivityCard = ({ activity }) => {
  const { icon, color } = ICONS[activity.type] || { icon: '📄', color: 'bg-gray-100 text-gray-600' };
  const statusStyle = STATUS_STYLES[activity.status] || STATUS_STYLES.draft;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${color}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className="font-semibold text-gray-800">{activity.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyle}`}>
              {activity.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Due: {formatDate(activity.dueAt)}
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
               <p className="text-sm text-gray-600">Assigned to {activity.assignedCount} mentees</p>
            </div>
            <button className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200">
              View Submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
