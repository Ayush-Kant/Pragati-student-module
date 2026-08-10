import JoinSessionButton from "./JoinSessionButton";
import AttendanceStatus from "./AttendanceStatus";
import SessionTimer from "./SessionTimer";
import { SESSION_STATUS_COLORS } from "../constants/liveSessionsConstants";
import {
  formatSessionTime,
  getSessionTimingLabel,
} from "../utils/liveSessionsHelpers";

const SessionCard = ({ session, onView }) => {
  if (!session) return null;

  const statusColor =
    SESSION_STATUS_COLORS[session.status] ||
    SESSION_STATUS_COLORS.Upcoming;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs text-gray-500">
          {session.category || "Live Session"}
        </span>

        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
        >
          {session.status}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onView?.(session)}
        className="text-left"
      >
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 transition-colors hover:text-blue-600">
          {session.title}
        </h3>
      </button>

      <p className="mt-2 text-xs text-gray-500">
        {session.mentor || "Mentor"} ·{" "}
        {formatSessionTime(session.startTime)}
      </p>

      <p className="mt-1 text-xs font-medium text-gray-600">
        {getSessionTimingLabel(session)}
      </p>

      {session.status === "Upcoming" && (
        <div className="mt-3">
          <SessionTimer
            startTime={session.startTime}
            status={session.status}
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {session.status === "Completed" ? (
          <AttendanceStatus status={session.attendanceStatus} />
        ) : (
          <JoinSessionButton session={session} />
        )}

        <button
          type="button"
          onClick={() => onView?.(session)}
          className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          View Details →
        </button>
      </div>
    </article>
  );
};

export default SessionCard;