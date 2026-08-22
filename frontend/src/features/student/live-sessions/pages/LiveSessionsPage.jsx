// LiveSessionsPage.jsx
// Entry page for the Live Sessions module (MOD-04 / issue #421-422)
// Pages -> Components -> Hooks -> Services -> Backend APIs

import { useState } from "react";

import useLiveSessions from "../hooks/useLiveSessions";
import useAttendance from "../hooks/useAttendance";
import useRecordings from "../hooks/useRecordings";

import SessionCard from "../components/SessionCard";
import SessionDetails from "../components/SessionDetails";
import SessionFilter from "../components/SessionFilter";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

import { EMPTY_MESSAGES } from "../constants/liveSessionsConstants";

const LiveSessionsPage = () => {
  const {
    sessions,
    statusFilter,
    setStatusFilter,
    loading,
    error,
    refetch,
  } = useLiveSessions();

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || null;

  const { attendance, loading: attendanceLoading } = useAttendance(
    selectedSession?.status === "Completed" ? selectedSessionId : null
  );
  const { recording, loading: recordingLoading } = useRecordings(
    selectedSession?.status === "Completed" ? selectedSessionId : null
  );

  const handleSelectSession = (session) => setSelectedSessionId(session.id);
  const handleBack = () => setSelectedSessionId(null);

  if (selectedSessionId) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <button
          onClick={handleBack}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
        >
          ← Back to Sessions
        </button>

        <SessionDetails
          session={selectedSession}
          loading={loading}
          error={error}
          onRetry={refetch}
          attendance={attendance}
          attendanceLoading={attendanceLoading}
          recording={recording}
          recordingLoading={recordingLoading}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Live Sessions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Join upcoming sessions, check attendance, and watch past recordings.
        </p>
      </div>

      <SessionFilter value={statusFilter} onChange={setStatusFilter} />

      {loading ? (
        <LoadingSpinner label="Loading live sessions..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !sessions.length ? (
        <EmptyState title="No sessions found" message={EMPTY_MESSAGES.SESSIONS} icon="📅" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} onView={handleSelectSession} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveSessionsPage;
