// liveSessionsValidation.js
// Basic validation rules for the Live Sessions module.
// Not called out explicitly in the issue spec, but kept minimal and used
// defensively in the hooks to guard against malformed session records.

export const validateSession = (session) => {
  const errors = {};

  if (!session) {
    return { valid: false, errors: { session: "Session data is required" } };
  }
  if (!session.title || !session.title.trim()) errors.title = "Session title is required";
  if (!session.mentor) errors.mentor = "Mentor name is required";
  if (!session.startTime) errors.startTime = "Session start time is required";
  if (!session.endTime) errors.endTime = "Session end time is required";
  if (session.startTime && session.endTime && new Date(session.startTime) >= new Date(session.endTime)) {
    errors.time = "Start time must be before end time";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateAttendanceStatus = (status) => {
  const allowed = ["Present", "Absent", "Not Marked"];
  const valid = allowed.includes(status);
  return {
    valid,
    errors: valid ? {} : { attendanceStatus: `Attendance status must be one of: ${allowed.join(", ")}` },
  };
};
