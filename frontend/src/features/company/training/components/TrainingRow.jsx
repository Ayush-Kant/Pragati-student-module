import { useState } from 'react';
import { MoreVertical, ChevronDown } from 'lucide-react';
import { TrainingStatusBadge } from './TrainingStatusBadge';

export const TrainingRow = ({ program, onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const renderProgressBar = (percentage, type = 'completion') => {
    const numValue = parseInt(percentage);
    const barColor = type === 'completion' ? 'bg-cyan-500' : 'bg-blue-500';
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all`}
            style={{ width: `${numValue}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 min-w-12 text-right">{percentage}</span>
      </div>
    );
  };

  const handleMenuItemClick = (action) => {
    setIsDropdownOpen(false);
    // Can be extended to handle different actions
    onMenuClick(program, action);
  };

  return (
    <tr className="border-b border-slate-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900 text-sm">{program.program}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
            {program.mentorInitials}
          </div>
          <span className="text-sm text-gray-600">{program.mentor}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          {program.students}
        </div>
      </td>
      <td className="px-6 py-4">
        {renderProgressBar(program.completion, 'completion')}
      </td>
      <td className="px-6 py-4">
        {renderProgressBar(program.attendance, 'attendance')}
      </td>
      <td className="px-6 py-4">
        <TrainingStatusBadge status={program.status} />
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <button
                onClick={() => handleMenuItemClick('view')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
              >
                View Details
              </button>
              <button
                onClick={() => handleMenuItemClick('edit')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit Program
              </button>
              <button
                onClick={() => handleMenuItemClick('manage')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Manage Students
              </button>
              <button
                onClick={() => handleMenuItemClick('complete')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Mark Complete
              </button>
              <button
                onClick={() => handleMenuItemClick('delete')}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
