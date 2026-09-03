const DAILY_API_URL = process.env.DAILY_API_URL || 'https://api.daily.co/v1';

const dailyRequest = async (path, options = {}) => {
  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) {
    const error = new Error('Daily.co integration is not configured. Set DAILY_API_KEY on the backend.');
    error.status = 503;
    throw error;
  }
  const response = await fetch(`${DAILY_API_URL}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
  if (!response.ok) {
    const error = new Error(body?.error || body?.info || `Daily.co request failed (${response.status})`);
    error.status = response.status >= 500 ? 502 : response.status;
    error.dailyStatus = response.status;
    throw error;
  }
  return body;
};

export const ensureRoom = async ({ roomName, meetingUrl }) => {
  if (meetingUrl) return { roomName, meetingUrl };
  try {
    const body = await dailyRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify({ name: roomName, properties: { enable_recording: 'cloud' } }),
    });
    return { roomName: body?.name || roomName, meetingUrl: body?.url || null };
  } catch (error) {
    if (error.dailyStatus !== 409) throw error;
    const existing = await dailyRequest(`/rooms/${encodeURIComponent(roomName)}`);
    return { roomName: existing?.name || roomName, meetingUrl: existing?.url || null };
  }
};

export const createParticipantToken = async ({ roomName, userName, expiresAt }) => {
  const body = await dailyRequest('/meeting-tokens', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: userName || 'Student',
        is_owner: false,
        exp: Math.floor(new Date(expiresAt).getTime() / 1000),
      },
    }),
  });
  if (!body?.token) {
    const error = new Error('Daily.co did not return a participant token.');
    error.status = 502;
    throw error;
  }
  return body.token;
};

export default { ensureRoom, createParticipantToken };
