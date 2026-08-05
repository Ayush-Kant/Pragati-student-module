// ── Active Placement Drive Data ──
export const activeDriveData = {
  id: "drive-101",
  companyName: "Google",
  companyLogo: "https://via.placeholder.com/40",
  role: "Frontend Developer",
  package: "18 LPA",
  location: "Bengaluru, India",
  status: "Shortlisted",
  deadline: "2026-08-15",
  eligibility: "75% + Attendance",
};

// ── Top Bar Statistics ──
export const statisticsData = {
  appliedDrives: 12,
  shortlistedDrives: 4,
  upcomingInterviews: 2,
  placementRate: "85%",
  attendancePercentage: 88,
  xp: 1450,
};

// ── Overall Progress Ring Metrics ──
export const progressData = {
  overallProgress: 78,
  courseProgress: 78,
  attendanceRate: 88,
  totalXp: 1450,
  completedModules: 14,
  totalModules: 18,
};

// ── Upcoming Sessions Data ──
export const upcomingSessionsData = [
  {
    id: "session-1",
    title: "React Development Session",
    mentor: "Senior React Engineer",
    date: "2026-08-10",
    time: "10:00 AM",
    type: "Session",
    status: "upcoming",
  },
  {
    id: "session-2",
    title: "Project Review",
    mentor: "Technical Mentor",
    date: "2026-08-12",
    time: "2:00 PM",
    type: "Review",
    status: "scheduled",
  },
];

// ── Pending Tasks Data ──
export const pendingTasksData = [
  {
    id: "task-1",
    title: "Complete Dashboard UI",
    dueDate: "2026-08-01",
    status: "pending",
  },
  {
    id: "task-2",
    title: "Submit React Assignment",
    dueDate: "2026-08-05",
    status: "in_progress",
  },
];

// ── Leaderboard Rankings Data (Explicitly Exported with IDs) ──
export const leaderboardData = [
  { id: "lead-1", rank: 1, name: "Aarav Sharma", score: 1850 },
  { id: "lead-2", rank: 2, name: "Rudransh Pandey", score: 1450 },
  { id: "lead-3", rank: 3, name: "Priya Patel", score: 1320 },
];

// ── Recent Notifications Data ──
export const recentNotificationsData = [
  {
    id: "notif-1",
    title: "New Assignment",
    message: "New React assignment added",
    date: "2 hours ago",
    status: "unread",
  },
  {
    id: "notif-2",
    title: "Session Reminder",
    message: "Your session starts tomorrow",
    date: "Yesterday",
    status: "read",
  },
];

// ── Primary Aggregated Export for Services & Hooks ──
export const mockDashboardData = {
  studentName: "Rudransh Pandey",
  activeDrive: activeDriveData,
  statistics: statisticsData,
  progress: progressData,
  upcomingActivities: upcomingSessionsData,
  pendingTasks: pendingTasksData,
  leaderboard: leaderboardData,
  notifications: recentNotificationsData,
};