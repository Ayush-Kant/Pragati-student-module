export const quickStatsData = [
  { title: "Applications", value: "12" },
  { title: "Interviews", value: "4" },
  { title: "Tasks", value: "8" },
  { title: "Sessions", value: "5" },
];

export const activeDriveData = {
  company: "Google",
  role: "SDE Intern",
  package: "12 LPA",
  deadline: "20 June",
  status: "Active Drive",
};

export const progressRingData = {
  percentage: 75,
};

export const skillsBreakdownData = [
  { label: "DSA", value: "40%" },
  { label: "Projects", value: "30%" },
  { label: "Resume", value: "20%" },
  { label: "Aptitude", value: "10%" },
];

export const upcomingSessionsData = [
  {
    id: 1,
    title: "Mock Interview - HR Round",
    date: "2026-06-20",
    time: "10:00 AM",
    mentor: "Mr. Sharma",
  },
];

export const pendingTasksData = [
  {
    id: 1,
    title: "Complete profile details",
    dueDate: "2026-06-18",
    done: false,
  },
];

export const recentNotificationsData = [
  {
    id: 1,
    message: "New job posting from Infosys",
    time: "2 hours ago",
    read: false,
  },
];

export const leaderboardData = [
  {
    rank: 1,
    name: "Aditi Rao",
    score: 980,
    department: "Computer Engineering",
  },
];

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
