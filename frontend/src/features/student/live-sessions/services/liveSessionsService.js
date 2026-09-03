import api from "../../../../services/api";

const unwrap = (response) => response?.data?.data ?? response?.data;

const toIsoDateTime = (date, time) => {
  if (!date || !time) return null;
  const value = new Date(`${date}T${time}`);
  return Number.isNaN(value.getTime()) ? null : value.toISOString();
};

const parseDurationMinutes = (duration) => {
  if (typeof duration === "number" && Number.isFinite(duration)) return duration;
  const match = String(duration || "").match(/(\d+(?:\.\d+)?)\s*(?:min|mins|minutes?)/i);
  return match ? Number(match[1]) : 0;
};

const normalizeSession = (session) => {
  const startTime = session?.scheduledAt || toIsoDateTime(session?.date, session?.time);
  const durationMinutes = parseDurationMinutes(session?.duration);
  const endDate = startTime ? new Date(startTime) : null;
  if (endDate && durationMinutes > 0) {
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);
  }

  return {
    ...session,
    mentor: session?.trainer || session?.mentor || "Training Mentor",
    category: session?.sessionType || session?.category || "Live Session",
    startTime,
    endTime: endDate && !Number.isNaN(endDate.getTime()) ? endDate.toISOString() : startTime,
    description: session?.description || "Join this live learning session and participate with your training cohort.",
    meetingLink: session?.meetingLink || session?.meetingUrl || "",
  };
};

export const getLiveSessions = async () => {
  const response = await api.get("/student/sessions");
  const data = unwrap(response);
  return (Array.isArray(data) ? data : []).map(normalizeSession);
};

export const getSessionById = async (sessionId) => {
  const response = await api.get(`/student/sessions/${sessionId}`);
  return normalizeSession(unwrap(response));
};

export const joinSession = async (sessionId) => {
  const response = await api.post(`/student/sessions/${sessionId}/join`);
  return unwrap(response);
};

export const leaveSession = async (sessionId) => {
  const response = await api.post(`/student/sessions/${sessionId}/leave`);
  return unwrap(response);
};

export const getAttendance = async (sessionId) => {
  const response = await api.get("/student/sessions/attendance", {
    params: { sessionId },
  });
  const data = unwrap(response);
  if (Array.isArray(data)) return data[0] || null;
  return data;
};

export const getRecordings = async (sessionId) => {
  const response = await api.get("/student/sessions/recordings");
  const data = unwrap(response);
  const recordings = Array.isArray(data) ? data : [];
  return recordings.find((recording) => Number(recording.sessionId) === Number(sessionId)) || null;
};
