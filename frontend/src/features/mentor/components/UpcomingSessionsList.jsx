import React from "react";

const UpcomingSessionsList = ({ sessions }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-sm text-gray-700">Upcoming Sessions</p>
        <span className="text-blue-500 text-xs cursor-pointer font-medium">View Calendar</span>
      </div>

      {!sessions || sessions.length === 0 ? (
        <p className="text-gray-400 text-sm">No upcoming sessions</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((session, index) => {
            const date = new Date(session.scheduledAt);
            const dateStr = date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
            const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            const avatarColors = ["bg-pink-400", "bg-blue-400", "bg-green-400"];
            return (
              <div key={session.sessionId} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {session.title.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{session.title}</p>
                  <p className="text-xs text-gray-400">{session.mentor || "Mentor"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">📅 {dateStr}</p>
                  <p className="text-xs text-gray-400">🕐 {timeStr}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="mt-4 text-blue-500 text-xs font-medium flex items-center gap-1">
        View All Sessions →
      </button>
    </div>
  );
};

export default UpcomingSessionsList;