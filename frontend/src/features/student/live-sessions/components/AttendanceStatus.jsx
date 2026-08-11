// AttendanceStatus.jsx
// Small badge showing a session's attendance status

import { ATTENDANCE_STATUS_COLORS } from "../constants/liveSessionsConstants";

const AttendanceStatus = ({ status = "Not Marked" }) => {
  const color = ATTENDANCE_STATUS_COLORS[status] || ATTENDANCE_STATUS_COLORS["Not Marked"];
  const icon = status === "Present" ? "✅" : status === "Absent" ? "❌" : "➖";

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
      <span>{icon}</span>
      {status}
    </span>
  );
};

export default AttendanceStatus;
