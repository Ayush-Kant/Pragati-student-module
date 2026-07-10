import React from "react";
import { Eye, Edit2, Trash2, Calendar, DollarSign, MapPin } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/placementDriveHelpers";

const DriveCard = ({ drive, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col justify-between gap-5 h-full">
      {/* Upper section */}
      <div className="space-y-4">
        {/* Header (Logo + Company & Status) */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ff7a00] font-extrabold text-lg flex items-center justify-center border border-orange-100 shrink-0">
              {drive.company?.charAt(0)}
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 leading-tight">
                {drive.company}
              </h4>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {drive.role}
              </p>
            </div>
          </div>
          <StatusBadge status={drive.status} />
        </div>

        {/* Details list */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Package */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Package
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-800">
              <DollarSign size={13} className="text-gray-400 shrink-0" />
              <span>{drive.package}</span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Location
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-800">
              <MapPin size={13} className="text-gray-400 shrink-0" />
              <span>{drive.location || "Bangalore"}</span>
            </div>
          </div>

          {/* Drive Date */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Drive Date
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <Calendar size={13} className="text-gray-400 shrink-0" />
              <span>{formatDate(drive.driveDate)}</span>
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Deadline
            </span>
            <div className="text-xs text-gray-700 font-medium">
              {formatDate(drive.deadline)}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 shrink-0 mt-auto">
        <button
          onClick={() => onView(drive)}
          className="flex items-center justify-center gap-1 text-xs font-bold text-[#ff7a00] hover:text-[#e06b00]"
        >
          <Eye size={14} />
          <span>View Details</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(drive)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit Drive"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(drive.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
