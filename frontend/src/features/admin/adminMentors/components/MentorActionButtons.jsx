import {
  FaUserPlus,
  FaExchangeAlt,
  FaTrash,
} from "react-icons/fa";

const MentorActionButtons = ({
  mentor,
  onAssign,
  onReplace,
  onRemove,
}) => {
  return (
    <div className="flex items-center gap-2">

      {/* Assign */}
      <button
        title="Assign Mentor"
        onClick={() => onAssign(mentor)}
        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
      >
        <FaUserPlus size={14} />
      </button>

      {/* Replace */}
      {mentor.activeBatches > 0 && (
        <button
          title="Replace Mentor"
          onClick={() => onReplace(mentor)}
          className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
        >
          <FaExchangeAlt size={14} />
        </button>
      )}

      {/* Remove */}
      <button
        title="Remove Mentor"
        onClick={() => onRemove(mentor.id)}
        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
      >
        <FaTrash size={14} />
      </button>

    </div>
  );
};

export default MentorActionButtons;