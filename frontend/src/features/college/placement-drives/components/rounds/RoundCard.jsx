import React from "react";
import { Trash2, GripVertical } from "lucide-react";
import RoundStatus from "./RoundStatus";

const RoundCard = ({
  round,
  index,
  onUpdateStatus,
  onDelete,
  isEditable = true,
}) => {
  return (
    <div className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all gap-4">
      <div className="flex items-center gap-3">
        {isEditable && (
          <GripVertical className="text-gray-400 cursor-grab active:cursor-grabbing shrink-0" size={18} />
        )}
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-50 text-[#ff7a00] font-bold text-xs shrink-0">
          {index + 1}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-800">{round.name}</h4>
          {round.date && (
            <p className="text-[11px] text-gray-500 mt-0.5">
              Scheduled Date: {new Date(round.date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <RoundStatus
          status={round.status}
          onChange={(newStatus) => onUpdateStatus(newStatus)}
          isEditable={isEditable}
        />
        {isEditable && (
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete Round"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RoundCard;
