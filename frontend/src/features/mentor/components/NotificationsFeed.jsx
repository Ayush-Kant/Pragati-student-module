import React from "react";

const getIcon = (type) => {
  switch (type) {
    case "submission": return { icon: "📄", bg: "#EEF2FF" };
    case "session":    return { icon: "🎥", bg: "#ECFDF5" };
    case "review":     return { icon: "✅", bg: "#F0FDF4" };
    default:           return { icon: "🔔", bg: "#FEF3C7" };
  }
};

const NotificationsFeed = ({ notifications }) => {
  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <p style={{ fontSize: "12px", fontWeight: "600", color: "#1F2937", margin: 0 }}>🔔 Recent Activity</p>
        <span style={{ fontSize: "10px", color: "#4F46E5", cursor: "pointer" }}>View All</span>
      </div>
      {!notifications || notifications.length === 0 ? (
        <p style={{ color: "#9CA3AF", fontSize: "12px" }}>No new notifications</p>
      ) : (
        notifications.map((item, index) => {
          const { icon, bg } = getIcon(item.type);
          return (
            <div key={index} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "7px 0",
              borderBottom: index < notifications.length - 1 ? "1px solid #F3F4F6" : "none"
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: bg, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "13px", flexShrink: 0
              }}>
                {icon}
              </div>
              <span style={{ fontSize: "11px", color: "#374151", lineHeight: "1.4" }}>
                {item.message}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default NotificationsFeed;