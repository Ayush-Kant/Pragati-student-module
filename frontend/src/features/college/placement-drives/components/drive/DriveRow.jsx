import React from "react";
import { Eye, Edit2, Trash2, Calendar, DollarSign } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/placementDriveHelpers";

const DriveRow = ({ drive, onView, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
      {/* Company & Role */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff7a00] font-bold text-sm flex items-center justify-center border border-orange-100 shrink-0">
            {drive.company?.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 leading-tight">
              {drive.company}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {drive.role}
            </div>
          </div>
        </div>
      </td>

      {/* Package */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
          <DollarSign size={14} className="text-gray-400 shrink-0" />
          <span>{drive.package}</span>
        </div>
      </td>

      {/* Drive Date */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-sm text-gray-700">
          <Calendar size={14} className="text-gray-400 shrink-0" />
          <span>{formatDate(drive.driveDate)}</span>
        </div>
      </td>

      {/* Application Deadline */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <div className="text-sm text-gray-700 font-medium">
          {formatDate(drive.deadline)}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <StatusBadge status={drive.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4.5 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onView(drive)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#ff7a00] hover:bg-[#fff4ec] transition-all"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(drive)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Edit Drive"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(drive.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
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
