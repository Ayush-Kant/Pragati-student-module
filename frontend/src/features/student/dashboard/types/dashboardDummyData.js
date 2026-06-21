
// 
export const activeDriveData = {
  companyName: "TCS",
  role: "Software Engineer",
  driveDate: "2026-06-25",
  status: "upcoming",
  eligibility: "Eligible",
  registrationDeadline: "2026-06-20",
};

export const quickStatsData = {
  applicationsSubmitted: 12,
  interviewsScheduled: 3,
  offersReceived: 1,
  profileCompletion: 85,
};

export const progressRingData = {
  profileCompletion: 85,
  trainingCompletion: 60,
  resumeScore: 75,
};

//
export const upcomingSessionsData = [
  {
    id: 1,
    title: "Mock Interview - HR Round",
    date: "2026-06-20",
    time: "10:00 AM",
    mentor: "Mr. Sharma",
  },
  {
    id: 2,
    title: "Resume Building Workshop",
    date: "2026-06-22",
    time: "2:00 PM",
    mentor: "Ms. Verma",
  },
];

export const pendingTasksData = [
  { id: 1, title: "Complete profile details", dueDate: "2026-06-18", done: false },
  { id: 2, title: "Upload updated resume", dueDate: "2026-06-19", done: false },
  { id: 3, title: "Register for TCS drive", dueDate: "2026-06-20", done: true },
];

export const recentNotificationsData = [
  { id: 1, message: "New job posting from Infosys", time: "2 hours ago", read: false },
  { id: 2, message: "Your resume was shortlisted for TCS", time: "1 day ago", read: false },
  { id: 3, message: "Training module 'DSA Basics' completed", time: "2 days ago", read: true },
];


export const leaderboardData = [
  { rank: 1, name: "Aditi Rao",        score: 980, department: "Computer Engineering", avatarColor: "bg-yellow-100 text-yellow-700" },
  { rank: 2, name: "Rohan Mehta",      score: 945, department: "Information Technology", avatarColor: "bg-gray-100 text-gray-700" },
  { rank: 3, name: "Sneha Patil",      score: 910, department: "Computer Engineering", avatarColor: "bg-orange-100 text-orange-700" },
  { rank: 4, name: "Vaishnavi Chaudhari", score: 875, department: "Computer Engineering", avatarColor: "bg-blue-100 text-blue-700" },
  { rank: 5, name: "Karan Singh",      score: 860, department: "Mechanical Engineering", avatarColor: "bg-blue-100 text-blue-700" },
];

// ── Combined API Response ─────────────────────────────────
export const dashboardApiResponse = {
  success: true,
  data: {
    activeDrive: activeDriveData,
    quickStats: quickStatsData,
    progressRing: progressRingData,
    upcomingSessions: upcomingSessionsData,
    pendingTasks: pendingTasksData,
    leaderboard: leaderboardData,
    recentNotifications: recentNotificationsData,
  },
};
