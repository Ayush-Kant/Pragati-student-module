// LiveSessionsPage.jsx
// ⚠️ RESERVED FILE — only the Team Lead (@bhavyachawda07) modifies this per project rules.
// This is the single top-level page for the Live Sessions module. It wires
// Pages → Components → Hooks → Services together and should stay thin:
// data + orchestration only, no business logic (that belongs in hooks/services).

import { useState } from "react";
import { useLiveSessions } from "../hooks/useLiveSessions";
import { useAttendance } from "../hooks/useAttendance";
import { useRecordings } from "../hooks/useRecordings";
import { useSessionFilters } from "../hooks/useSessionFilters";

import UpcomingSessions from "../components/sessions/UpcomingSessions";
import PastSessions from "../components/sessions/PastSessions";
import SessionDetails from "../components/sessions/SessionDetails";
import RecordingList from "../components/recordings/RecordingList";
import AttendanceHistory from "../components/attendance/AttendanceHistory";
import AttendanceProgress from "../components/attendance/AttendanceProgress";

import SearchSession from "../components/filters/SearchSession";
import StatusFilter from "../components/filters/StatusFilter";
import DateFilter from "../components/filters/DateFilter";
import TrainerFilter from "../components/filters/TrainerFilter";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import ConfirmationModal from "../components/common/ConfirmationModal";

export default function LiveSessionsPage() {
  const {
    sessions,
    isLoading,
    error,
    refetch,
    joinSession,
    leaveSession,
    isJoining,
  } = useLiveSessions();

  const {
    search,
    setSearch,
    status,
    setStatus,
    dateRange,
    setDateRange,
    trainer,
    setTrainer,
    trainerOptions,
    filteredSessions,
  } = useSessionFilters(sessions);

  const { attendanceHistory, progress } = useAttendance(sessions);
  const { recordings, download, isDownloading } = useRecordings();

  const [selectedSession, setSelectedSession] = useState(null);
  const [activeSession, setActiveSession] = useState(null); // session currently "joined"
  const [leaveTarget, setLeaveTarget] = useState(null);

  const upcoming = filteredSessions.filter((s) => s.status === "Upcoming" || s.status === "Ongoing");
  const past = filteredSessions.filter((s) => s.status === "Completed" || s.status === "Cancelled");

  const handleJoin = async (sessionId) => {
    const result = await joinSession(sessionId);
    if (result.success) {
      setActiveSession(sessions.find((s) => s.id === sessionId) || null);
      setSelectedSession(null);
    }
  };

  const confirmLeave = async () => {
    if (leaveTarget) {
      await leaveSession(leaveTarget.id);
    }
    setActiveSession(null);
    setLeaveTarget(null);
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading live sessions…" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Live Sessions</h1>
        <p className="mt-1 text-sm text-slate-500">
          Join live classes, catch up on recordings, and track your attendance.
        </p>
      </header>

      <AttendanceProgress progress={progress} />

      <div className="flex flex-wrap items-center gap-3">
        <SearchSession value={search} onChange={setSearch} />
        <StatusFilter value={status} onChange={setStatus} />
        <DateFilter value={dateRange} onChange={setDateRange} />
        <TrainerFilter value={trainer} onChange={setTrainer} options={trainerOptions} />
      </div>

      <UpcomingSessions
        sessions={upcoming}
        onViewDetails={setSelectedSession}
        onJoin={handleJoin}
        isJoining={isJoining}
      />

      <PastSessions sessions={past} onViewDetails={setSelectedSession} />

      <RecordingList
        recordings={recordings}
        onPlay={setSelectedSession}
        onDownload={download}
        isDownloading={isDownloading}
      />

      <AttendanceHistory history={attendanceHistory} />

      {selectedSession && (
        <SessionDetails
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onJoin={handleJoin}
          isJoining={isJoining(selectedSession.id)}
        />
      )}

      <ConfirmationModal
        isOpen={!!leaveTarget}
        title="Leave this session?"
        message="You can rejoin anytime before it ends."
        confirmLabel="Leave"
        tone="danger"
        onConfirm={confirmLeave}
        onCancel={() => setLeaveTarget(null)}
      />
    </div>
  );
}
