// SessionDetails.jsx
// Full session detail view: metadata, join CTA, attendance status, and recording (if completed)

import JoinSessionButton from "./JoinSessionButton";
import AttendanceStatus from "./AttendanceStatus";
import RecordingCard from "./RecordingCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";
import { SESSION_STATUS_COLORS } from "../constants/liveSessionsConstants";
import { formatSessionTime } from "../utils/liveSessionsHelpers";

const SessionDetails = ({
  session,
  loading,
  error,
  onRetry,
  attendance,
  attendanceLoading,
  recording,
  recordingLoading,
}) => {
  if (loading) return <LoadingSpinner label="Loading session..." />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!session) return null;

  const statusColor = SESSION_STATUS_COLORS[session.status] || SESSION_STATUS_COLORS.Upcoming;
  const isCompleted = session.status === "Completed";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className={`w-fit inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${statusColor.bg} ${statusColor.text}`}>
          {session.status}
        </span>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{session.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {session.mentor} · {session.category}
        </p>
        <p className="text-sm text-gray-500">
          {formatSessionTime(session.startTime)} – {formatSessionTime(session.endTime)}
        </p>
      </div>

      <p className="text-sm text-gray-600">{session.description}</p>

      <div className="flex items-center gap-4">
        {!isCompleted && <JoinSessionButton session={session} />}
        {isCompleted && (
          <div>
            <p className="text-xs text-gray-400 mb-1">Attendance</p>
            {attendanceLoading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <AttendanceStatus status={attendance?.status} />
            )}
          </div>
        )}
      </div>

      {isCompleted && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Session Recording</p>
          <RecordingCard recording={recording} loading={recordingLoading} />
        </div>
      )}
    </div>
  );
};

export default SessionDetails;
