import { FiMoreVertical } from 'react-icons/fi';
import { StatusBadge } from './StatusBadge';

export const CandidateRow = ({ candidate, onSelect, onMenuClick }) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-colors duration-200">
      {/* Candidate Info */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4" onClick={() => onSelect(candidate)}>
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {candidate.avatar}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-base">{candidate.name}</p>
          </div>
        </div>
      </td>

      {/* College */}
      <td className="px-6 py-5">
        <p className="text-gray-700 font-medium">{candidate.college}</p>
      </td>

      {/* Role */}
      <td className="px-6 py-5">
        <p className="text-gray-700 font-medium">{candidate.role}</p>
      </td>

      {/* Score */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">📌</span>
          <span className="font-bold text-gray-900 text-base">{candidate.score}%</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <StatusBadge status={candidate.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick(candidate);
          }}
          className="p-2 hover:bg-gray-200/60 rounded-lg transition-colors duration-150"
        >
          <FiMoreVertical size={20} className="text-gray-500" />
        </button>
      </td>
    </tr>
  );
};
