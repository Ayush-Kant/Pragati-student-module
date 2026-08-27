import React from "react";
import { Link } from "react-router-dom";

export default function UpcomingSessionsList({ sessions = [] }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Upcoming Sessions</h3>
        <Link to="/student/sessions" className="text-xs font-semibold text-blue-600 hover:underline">
          View All →
        </Link>
      </div>

      {!sessions.length ? (
        <p className="text-sm text-gray-500">No upcoming live sessions scheduled.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.sessionId} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border">
              <div>
                <p className="font-semibold text-sm text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(s.scheduledAt).toLocaleString()} • {s.mentorName}
                </p>
              </div>
              <Link
                to="/student/sessions"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition"
              >
                Join
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}