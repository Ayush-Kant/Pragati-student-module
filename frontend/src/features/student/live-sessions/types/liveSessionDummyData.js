// liveSessionDummyData.js
// ⚠️ RESERVED FILE — only the Team Lead (@bhavyachawda07) modifies this per project rules.
// Everyone else: import from here, never fork a second dummy data file.
//
// This mirrors the exact shape the real backend API is expected to return,
// so swapping liveSessionService.js over to real endpoints later is a
// drop-in change with no shape changes needed downstream.

export const liveSessions = [
  {
    id: 1,
    title: "React Fundamentals",
    trainer: "John Doe",
    date: "2026-08-15",
    time: "10:00 AM",
    duration: "2 Hours",
    status: "Upcoming",
    attendance: "Pending",
    agenda:
      "Introduction to components, props, and state. Hands-on with functional components and hooks.",
    meetingLink: "https://your-domain.daily.co/react-fundamentals-1",
    recordingUrl: null,
  },
  {
    id: 2,
    title: "Node.js Backend Development",
    trainer: "Jane Smith",
    date: "2026-08-18",
    time: "2:00 PM",
    duration: "90 Minutes",
    status: "Completed",
    attendance: "Present",
    agenda:
      "Building REST APIs with Express, middleware patterns, and error handling.",
    meetingLink: "https://your-domain.daily.co/nodejs-backend-1",
    recordingUrl: "https://your-domain.daily.co/recordings/nodejs-backend-1.mp4",
  },
];

export const liveSessionApiResponse = {
  success: true,
  data: liveSessions,
};
