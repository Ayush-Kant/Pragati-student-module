import api from "../../../../services/api";

const unwrap = (response) => response?.data?.data ?? response?.data;

const toIsoDateTime = (date, time) => {
  if (!date || !time) return null;
  const value = new Date(`${date}T${time}`);
  return Number.isNaN(value.getTime()) ? null : value.toISOString();
};

const parseDurationMinutes = (session) => {
  const serverMinutes = Number(session?.durationMinutes);
  if (Number.isFinite(serverMinutes) && serverMinutes >= 0) return serverMinutes;

  const text = String(session?.duration || "").trim().toLowerCase();
  const match = text.match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?|m)?/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return 0;
  const unit = match[2] || "minutes";
  return /^(hours?|hrs?|h)$/.test(unit) ? amount * 60 : amount;
};

const normalizeSession = (session) => {
  const startTime = session?.scheduledAt || toIsoDateTime(session?.date, session?.time);
  const durationMinutes = parseDurationMinutes(session);
  const endDate = startTime ? new Date(startTime) : null;
  if (endDate && durationMinutes > 0) {
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);
  }

  return {
    ...session,
    durationMinutes,
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
