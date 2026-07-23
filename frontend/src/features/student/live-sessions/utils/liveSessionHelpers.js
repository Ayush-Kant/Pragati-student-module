// Pure helper functions — no API calls, no React, easy to unit test.

/**
 * Parses "10:00 AM" + "2026-08-15" into a real Date object for sorting/comparison.
 */
export function toDateTime(dateStr, timeStr) {
  if (!dateStr) return null;
  const composite = timeStr ? `${dateStr} ${timeStr}` : dateStr;
  const parsed = new Date(composite);
  return isNaN(parsed.getTime()) ? new Date(dateStr) : parsed;
}

export function formatDate(dateStr) {
  const d = toDateTime(dateStr);
  if (!d) return "—";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isSessionToday(dateStr) {
  const d = toDateTime(dateStr);
  if (!d) return false;
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export function isSessionThisWeek(dateStr) {
  const d = toDateTime(dateStr);
  if (!d) return false;
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return d >= startOfWeek && d < endOfWeek;
}

export function isSessionThisMonth(dateStr) {
  const d = toDateTime(dateStr);
  if (!d) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export function sortSessionsByDate(sessions, direction = "asc") {
  const sorted = [...sessions].sort((a, b) => {
    const aTime = toDateTime(a.date, a.time)?.getTime() ?? 0;
    const bTime = toDateTime(b.date, b.time)?.getTime() ?? 0;
    return direction === "asc" ? aTime - bTime : bTime - aTime;
  });
  return sorted;
}

export function splitUpcomingAndPast(sessions) {
  const upcoming = sessions.filter((s) => s.status === "Upcoming" || s.status === "Ongoing");
  const past = sessions.filter((s) => s.status === "Completed" || s.status === "Cancelled");
  return { upcoming: sortSessionsByDate(upcoming, "asc"), past: sortSessionsByDate(past, "desc") };
}

export function statusBadgeTone(status) {
  switch (status) {
    case "Upcoming":
      return "upcoming";
    case "Ongoing":
      return "ongoing";
    case "Completed":
      return "completed";
    case "Cancelled":
      return "cancelled";
    default:
      return "default";
  }
}

export function attendanceBadgeTone(attendance) {
  switch (attendance) {
    case "Present":
      return "present";
    case "Absent":
      return "absent";
    case "Late":
      return "late";
    default:
      return "pending";
  }
}

export function calculateAttendanceProgress(sessions) {
  const eligible = sessions.filter((s) => s.status === "Completed");
  if (eligible.length === 0) return 0;
  const present = eligible.filter(
    (s) => s.attendance === "Present" || s.attendance === "Late"
  ).length;
  return Math.round((present / eligible.length) * 100);
}
