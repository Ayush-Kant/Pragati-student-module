import React from "react";
import { Link } from "react-router-dom";

export default function UpcomingSessionsList({ sessions = [] }) {
  const normalizedSessions = Array.isArray(sessions) ? sessions : [];

  return (
    <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Upcoming Sessions</h3>
        <Link
          to="/student/sessions"
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          View All →
        </Link>
      </div>

      {!normalizedSessions.length ? (
        <p className="text-sm text-gray-500">No upcoming live sessions scheduled.</p>
      ) : (
        <div className="space-y-3">
          {normalizedSessions.map((session, index) => {
            const key = session?.sessionId ?? session?.id ?? `${session?.scheduledAt ?? "session"}-${index}`;
            const scheduledAt = session?.scheduledAt ? new Date(session.scheduledAt) : null;
            const validDate = scheduledAt && !Number.isNaN(scheduledAt.getTime());

            return (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg border bg-gray-50 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {session?.title || "Live Session"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {validDate ? scheduledAt.toLocaleString() : "Schedule unavailable"}
                    {session?.mentorName ? ` • ${session.mentorName}` : ""}
                  </p>
                </div>
                <Link
                  to="/student/sessions"
                  className="ml-4 shrink-0 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700"
                >
                  Join
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
