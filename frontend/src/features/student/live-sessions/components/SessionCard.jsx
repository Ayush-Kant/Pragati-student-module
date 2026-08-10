// SessionCard.jsx
// Summary card for a single session in the live sessions listing

import JoinSessionButton from "./JoinSessionButton";
import AttendanceStatus from "./AttendanceStatus";
import { SESSION_STATUS_COLORS } from "../constants/liveSessionsConstants";
import { formatSessionTime, getSessionTimingLabel } from "../utils/liveSessionsHelpers";

const SessionCard = ({ session, onView }) => {
  const statusColor = SESSION_STATUS_COLORS[session.status] || SESSION_STATUS_COLORS.Upcoming;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {session.category}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor.bg} ${statusColor.text}`}>
          {session.status}
        </span>
      </div>

      <button onClick={() => onView?.(session)} className="text-left">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
          {session.title}
        </h3>
      </button>

      <p className="text-xs text-gray-500">
        {session.mentor} · {formatSessionTime(session.startTime)}
      </p>

      <p className="text-xs font-medium text-gray-600">{getSessionTimingLabel(session)}</p>

      {session.status === "Completed" ? (
        <AttendanceStatus status={session.attendanceStatus} />
      ) : (
        <JoinSessionButton session={session} />
      )}

      <button
        onClick={() => onView?.(session)}
        className="text-xs font-medium text-blue-600 hover:text-blue-700 self-start"
      >
        View Details →
      </button>
    </div>
  );
};

export default SessionCard;
