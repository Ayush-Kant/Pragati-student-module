// src/features/student/dashboard/types/dashboardDummyData.js

// Existing team data structures
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
];

// Required Ticket Data Structures (MOD-3)
export const dashboardData = {
  student: {
    id: 1,
    name: "John Doe",
    profileImage: "",
    department: "Information Technology"
  },
  statistics: {
    completedCourses: 8,
    activeCourses: 3,
    attendance: 92,
    xp: 1450
  },
  progress: {
    overallProgress: 76
  },
  upcomingActivities: [
    { id: 1, title: "React Core Concepts Quiz", type: "Quiz", deadline: "Today, 11:59 PM", status: "Pending" },
    { id: 2, title: "Tailwind UI Integration", type: "Assignment", deadline: "Tomorrow, 6:00 PM", status: "In Progress" },
    { id: 3, title: "Mentor Sync Call", type: "Session", deadline: "July 8, 2:00 PM", status: "Scheduled" }
  ],
  notifications: [
    { id: 1, title: "New Assignment Posted", description: "Module 3 - Context API challenge is live.", type: "Notification", time: "10 mins ago" },
    { id: 2, title: "System Maintenance", description: "Platform offline tonight from 2 AM to 4 AM.", type: "Announcement", time: "2 hours ago" }
  ],
  achievements: {
    badges: [
      { id: 1, title: "Fast Learner", icon: "⚡", description: "Completed 5 lessons in one day" },
      { id: 2, title: "Perfect Presence", icon: "📅", description: "Maintained >90% attendance" }
    ],
    xpMilestones: ["Level 4 Achieved", "1000 XP Club"],
    leaderboardPosition: 14
  }
};

export const dashboardApiResponse = {
  success: true,
  data: dashboardData
};