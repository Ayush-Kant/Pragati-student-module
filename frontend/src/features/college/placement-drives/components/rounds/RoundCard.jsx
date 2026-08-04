import React from "react";
import { Trash2, GripVertical } from "lucide-react";
import RoundStatus from "./RoundStatus";

const RoundCard = ({
  round,
  index,
  onUpdateStatus,
  onDelete,
  isEditable = true,
  darkMode,
}) => {
  return (
    <div className={`flex items-center justify-between p-3.5 border rounded-xl shadow-sm transition-all gap-4 ${
      darkMode
        ? 'bg-[#2D2D2D] border-[#3D3D3D] hover:shadow-md hover:border-[#4D4D4D]'
        : 'bg-white border-gray-100 hover:shadow-md hover:border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        {isEditable && (
          <GripVertical className={`shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'} cursor-grab active:cursor-grabbing`} size={18} />
        )}
        <div className={`flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs shrink-0 ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34]' : 'bg-orange-50 text-[#ff7a00]'}`}>
          {index + 1}
        </div>
        <div>
          <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{round.name}</h4>
          {round.date && (
            <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
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
          darkMode={darkMode}
        />
        {isEditable && (
          <button
            type="button"
            onClick={onDelete}
            className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
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
