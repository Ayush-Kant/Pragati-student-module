export const liveSessionSeedData = [
  {
    title: "React Fundamentals",
    trainer: "John Doe",
    date: "2026-08-15",
    time: "10:00 AM",
    duration: "2 Hours",
    status: "Upcoming",
    session_type: "webinar",
    scheduled_at: "2026-08-15T10:00:00Z",
  },
  {
    title: "Node.js Backend Development",
    trainer: "Jane Smith",
    date: "2026-08-18",
    time: "2:00 PM",
    duration: "90 Minutes",
    status: "Scheduled",
    session_type: "webinar",
    scheduled_at: "2026-08-18T14:00:00Z",
  },
];

export const attendanceSeedData = [
  {
    sessionId: 1,
    studentId: 101,
    status: "Present",
  },
];

export const recordingSeedData = [
  {
    title: "React Fundamentals Recording",
    duration: "2 Hours",
    recordingUrl: "/recordings/react-fundamentals.mp4",
    sessionId: 1,
  },
];

export const participantSeedData = [
  {
    sessionId: 1,
    studentId: 101,
  },
];

export const scheduleSeedData = [
  {
    title: "React Fundamentals",
    trainer: "John Doe",
    date: "2026-08-15",
    time: "10:00 AM",
    duration: "2 Hours",
    status: "Upcoming",
  },
  {
    title: "Node.js Backend Development",
    trainer: "Jane Smith",
    date: "2026-08-18",
    time: "2:00 PM",
    duration: "90 Minutes",
    status: "Scheduled",
  },
];

export default {
  liveSessionSeedData,
  attendanceSeedData,
  recordingSeedData,
  participantSeedData,
  scheduleSeedData,
};
