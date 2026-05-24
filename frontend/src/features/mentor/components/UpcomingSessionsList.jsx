import React from "react";

const avatarColors = ["#FEE2E2", "#DBEAFE", "#D1FAE5", "#FEF3C7"];
const avatarTextColors = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B"];

const UpcomingSessionsList = ({ sessions }) => {
  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <p style={{ fontSize: "12px", fontWeight: "600", color: "#1F2937", margin: 0 }}>📅 Upcoming Sessions</p>
        <span style={{ fontSize: "10px", color: "#4F46E5", cursor: "pointer" }}>View Calendar</span>
      </div>
      {!sessions || sessions.length === 0 ? (
        <p style={{ color: "#9CA3AF", fontSize: "12px" }}>No upcoming sessions</p>
      ) : (
        sessions.map((session, index) => (
          <div key={session.sessionId} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "8px 0",
            borderBottom: index < sessions.length - 1 ? "1px solid #F3F4F6" : "none"
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
              background: avatarColors[index % avatarColors.length],
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: "700",
              color: avatarTextColors[index % avatarTextColors.length]
            }}>
              {session.title.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "11px", fontWeight: "600", color: "#1F2937", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {session.title}
              </p>
              <p style={{ fontSize: "10px", color: "#6B7280", margin: 0 }}>
                {new Date(session.scheduledAt).toLocaleString("en-US", {
                  month: "numeric", day: "numeric", year: "numeric",
                  hour: "numeric", minute: "2-digit", hour12: true
                })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UpcomingSessionsList;