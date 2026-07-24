import React from "react";
import { Eye, Edit2, Trash2, Calendar, DollarSign } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/placementDriveHelpers";

const DriveRow = ({ drive, onView, onEdit, onDelete, darkMode }) => {
  return (
    <tr className={`transition-colors border-b last:border-0 ${darkMode ? 'hover:bg-[#1A1A1A] border-[#3D3D3D]' : 'hover:bg-gray-50/50 border-gray-100'}`}>
      {/* Company & Role */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center border shrink-0 ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34] border-[#ff6d34]/30' : 'bg-orange-50 text-[#ff7a00] border-orange-100'}`}>
            {drive.company?.charAt(0)}
          </div>
          <div>
            <div className={`text-sm font-semibold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {drive.company}
            </div>
            <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {drive.role}
            </div>
          </div>
        </div>
      </td>

      {/* Package */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <div className={`flex items-center gap-1 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          <DollarSign size={14} className={`shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <span>{drive.package}</span>
        </div>
      </td>

      {/* Drive Date */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <div className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <Calendar size={14} className={`shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <span>{formatDate(drive.driveDate)}</span>
        </div>
      </td>

      {/* Application Deadline */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {formatDate(drive.deadline)}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <StatusBadge status={drive.status} darkMode={darkMode} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4.5 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onView(drive)}
            className={`p-1.5 rounded-lg transition-all ${darkMode ? 'text-gray-400 hover:text-[#ff6d34] hover:bg-[#ff6d34]/10' : 'text-gray-400 hover:text-[#ff7a00] hover:bg-[#fff4ec]'}`}
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(drive)}
            className={`p-1.5 rounded-lg transition-all ${darkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
            title="Edit Drive"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(drive.id)}
            className={`p-1.5 rounded-lg transition-all ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
            title="Delete Drive"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DriveRow;
