import { MoreVertical } from 'lucide-react';
import { StageBadge } from './StageBadge';

export const DriveRow = ({ drive }) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <div className="font-semibold text-gray-900">{drive.driveName}</div>
          <div className="text-sm text-gray-500">{drive.role}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{drive.role}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          {drive.candidates}
        </div>
      </td>
      <td className="px-6 py-4">
        <StageBadge stage={drive.stage} />
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">{drive.deadline}</div>
      </td>
      <td className="px-6 py-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </td>
    </tr>
  );
};
