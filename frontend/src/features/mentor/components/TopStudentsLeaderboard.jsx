import React from "react";

const TopStudentsLeaderboard = ({ students }) => {
  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <p style={{ fontSize: "12px", fontWeight: "600", color: "#1F2937", margin: 0 }}>🏆 Top Students</p>
        <span style={{ fontSize: "10px", color: "#4F46E5", cursor: "pointer" }}>View Leaderboard</span>
      </div>
      {!students || students.length === 0 ? (
        <p style={{ color: "#9CA3AF", fontSize: "12px" }}>No students found</p>
      ) : (
        students.map((student, index) => (
          <div key={student.studentId} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "6px 0",
            borderBottom: index < students.length - 1 ? "1px solid #F3F4F6" : "none"
          }}>
            <span style={{ fontSize: "12px", fontWeight: "700", width: "16px", color: index === 0 ? "#F59E0B" : "#9CA3AF", flexShrink: 0 }}>
              {index + 1}
            </span>
            <div style={{
              width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
              background: index === 0 ? "#FEF3C7" : "#EEF2FF",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: "700",
              color: index === 0 ? "#F59E0B" : "#4F46E5"
            }}>
              {student.name.charAt(0)}
            </div>
            <span style={{
              flex: 1, fontSize: "11px",
              fontWeight: index === 0 ? "700" : "500",
              color: index === 0 ? "#F59E0B" : "#374151",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
            }}>
              {student.name}
            </span>
            <span style={{ fontSize: "11px", color: "#6B7280", width: "24px", textAlign: "right", flexShrink: 0 }}>
              {student.readinessScore}
            </span>
            <div style={{ width: "60px", height: "6px", background: "#F3F4F6", borderRadius: "4px", flexShrink: 0 }}>
              <div style={{
                width: `${Math.min(student.readinessScore, 100)}%`,
                height: "6px", borderRadius: "4px",
                background: index === 0 ? "#F59E0B" : "#4F46E5"
              }} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TopStudentsLeaderboard;