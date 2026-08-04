import React from "react";
import { Eye, Edit2, Trash2, Calendar, DollarSign, MapPin } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/placementDriveHelpers";

const DriveCard = ({ drive, onView, onEdit, onDelete, darkMode }) => {
  return (
    <div className={`rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between gap-5 h-full ${
      darkMode
        ? 'bg-[#2D2D2D] border border-[#3D3D3D] hover:shadow-md hover:border-[#4D4D4D]'
        : 'bg-white border border-gray-150 hover:shadow-md hover:border-gray-200'
    }`}>
      {/* Upper section */}
      <div className="space-y-4">
        {/* Header (Logo + Company & Status) */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl font-extrabold text-lg flex items-center justify-center border shrink-0 ${
              darkMode
                ? 'bg-[#ff6d34]/20 text-[#ff6d34] border-[#ff6d34]/30'
                : 'bg-orange-50 text-[#ff7a00] border-orange-100'
            }`}>
              {drive.company?.charAt(0)}
            </div>
            <div>
              <h4 className={`text-base font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {drive.company}
              </h4>
              <p className={`text-xs font-medium mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {drive.role}
              </p>
            </div>
          </div>
          <StatusBadge status={drive.status} darkMode={darkMode} />
        </div>

        {/* Details list */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Package */}
          <div className="space-y-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Package
            </span>
            <div className={`flex items-center gap-1 text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              <DollarSign size={13} className={`shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <span>{drive.package}</span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Location
            </span>
            <div className={`flex items-center gap-1 text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              <MapPin size={13} className={`shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <span>{drive.location || "Bangalore"}</span>
            </div>
          </div>

          {/* Drive Date */}
          <div className="space-y-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Drive Date
            </span>
            <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Calendar size={13} className={`shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <span>{formatDate(drive.driveDate)}</span>
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Deadline
            </span>
            <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatDate(drive.deadline)}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className={`flex items-center justify-between pt-4 border-t shrink-0 mt-auto ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-100'}`}>
        <button
          onClick={() => onView(drive)}
          className={`flex items-center justify-center gap-1 text-xs font-bold ${darkMode ? 'text-[#ff6d34] hover:text-[#ff8a5c]' : 'text-[#ff7a00] hover:text-[#e06b00]'}`}
        >
          <Eye size={14} />
          <span>View Details</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(drive)}
            className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
            title="Edit Drive"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(drive.id)}
            className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
            title="Delete Drive"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriveCard;
