import React from "react";

const statsConfig = [
  { icon: "👥", label: "Total Mentees", sub: "+12 this month", color: "#4F46E5", bg: "#EEF2FF" },
  { icon: "📅", label: "Active Sessions", sub: "+4 this week", color: "#10B981", bg: "#ECFDF5" },
  { icon: "📋", label: "Assessments", sub: "+6 this month", color: "#F59E0B", bg: "#FFFBEB" },
  { icon: "✅", label: "Tasks Assigned", sub: "+8 this week", color: "#8B5CF6", bg: "#F5F3FF" },
  { icon: "🎯", label: "Placement Progress", sub: "+9% this month", color: "#EF4444", bg: "#FEF2F2", percent: true },
];

const StatsRow = ({ totalMentees, activeSessions, assessments, tasksAssigned, placementProgress }) => {
  const values = [totalMentees, activeSessions, assessments, tasksAssigned, placementProgress];

  return (
    <>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-bottom: 12px;
        }
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
      <div className="stats-grid">
        {statsConfig.map((stat, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: "12px", padding: "12px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            borderTop: `3px solid ${stat.color}`
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: stat.bg, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "14px", marginBottom: "6px"
            }}>
              {stat.icon}
            </div>
            <p style={{ fontSize: "20px", fontWeight: "800", color: "#1F2937", margin: "0 0 2px" }}>
              {values[i] ?? 0}{stat.percent ? "%" : ""}
            </p>
            <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 0 2px" }}>{stat.label}</p>
            <p style={{ fontSize: "10px", color: stat.color, margin: 0, fontWeight: "500" }}>{stat.sub}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default StatsRow;