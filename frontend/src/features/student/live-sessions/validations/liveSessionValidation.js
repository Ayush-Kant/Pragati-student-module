// Validation layer — called from hooks/services before data is used or sent.
// Every function returns { valid: boolean, errors: string[] }.

const ok = () => ({ valid: true, errors: [] });
const fail = (...errors) => ({ valid: false, errors });

function isNil(value) {
  return value === null || value === undefined || value === "";
}

/** Null Validation — guards against missing/empty core fields anywhere. */
export function validateNotNull(fields = {}) {
  const errors = Object.entries(fields)
    .filter(([, value]) => isNil(value))
    .map(([key]) => `${key} is required`);
  return errors.length ? fail(...errors) : ok();
}

/** Session Validation — validates a full session object shape. */
export function validateSession(session) {
  if (isNil(session)) return fail("Session data is missing");

  const requiredCheck = validateNotNull({
    id: session.id,
    title: session.title,
    trainer: session.trainer,
    date: session.date,
    time: session.time,
    status: session.status,
  });
  if (!requiredCheck.valid) return requiredCheck;

  const validStatuses = ["Upcoming", "Ongoing", "Completed", "Cancelled"];
  if (!validStatuses.includes(session.status)) {
    return fail(`Invalid session status: ${session.status}`);
  }

  if (isNaN(new Date(session.date).getTime())) {
    return fail(`Invalid session date: ${session.date}`);
  }

  return ok();
}

/** Attendance Validation — validates attendance value + session linkage. */
export function validateAttendance(sessionId, attendanceValue) {
  const requiredCheck = validateNotNull({ sessionId, attendanceValue });
  if (!requiredCheck.valid) return requiredCheck;

  const validValues = ["Pending", "Present", "Absent", "Late"];
  if (!validValues.includes(attendanceValue)) {
    return fail(`Invalid attendance value: ${attendanceValue}`);
  }
  return ok();
}

/** Recording Validation — a recording can only be played/downloaded once it exists. */
export function validateRecording(session) {
  if (isNil(session)) return fail("Session data is missing");
  if (session.status !== "Completed") {
    return fail("Recording is only available once a session is completed");
  }
  if (isNil(session.recordingUrl)) {
    return fail("No recording is available for this session");
  }
  return ok();
}

/** Join Permission Validation — can this student join right now? */
export function validateJoinRequest(session) {
  if (isNil(session)) return fail("Session data is missing");
  if (isNil(session.meetingLink)) {
    return fail("This session has no meeting link configured");
  }
  if (session.status === "Completed") {
    return fail("This session has already ended");
  }
  if (session.status === "Cancelled") {
    return fail("This session was cancelled");
  }
  if (session.status !== "Upcoming" && session.status !== "Ongoing") {
    return fail("This session is not currently joinable");
  }
  return ok();
}
