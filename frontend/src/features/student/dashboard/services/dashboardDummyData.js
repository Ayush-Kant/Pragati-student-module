export const mockDashboardData = {
  activeDrive: {
    id: "drive-2026-01",
    title: "Full Stack Engineer Campus Placement Drive",
    companyName: "TechCorp Global",
    appliedDate: "2026-08-15",
    currentStage: "Technical Round",
    status: "In Progress",
    nextStep: "Technical Interview on Aug 30, 2026"
  },
  stats: {
    coursesCompleted: 4,
    assessmentsTaken: 12,
    codingProblemsSolved: 86,
    attendanceRate: "94%"
  },
  progress: {
    overallPercentage: 78,
    modulesCompleted: 7,
    totalModules: 9
  },
  upcomingSessions: [
    {
      id: "sess-01",
      title: "System Design & Microservices Architecture",
      mentor: "Dr. Arvind Sharma",
      scheduledAt: "2026-08-30T10:00:00.000Z",
      status: "upcoming"
    },
    {
      id: "sess-02",
      title: "React Performance Optimization Deep Dive",
      mentor: "Priya Nair",
      scheduledAt: "2026-09-02T14:30:00.000Z",
      status: "scheduled"
    }
  ],
  pendingTasks: [
    {
      taskId: "task-01",
      title: "Assignment 4: State Management with Redux",
      type: "assignment",
      dueAt: "2026-08-31T23:59:59.000Z"
    },
    {
      taskId: "task-02",
      title: "Assessment: Data Structures & Dynamic Programming",
      type: "assessment",
      dueAt: "2026-09-01T23:59:59.000Z"
    }
  ],
  leaderboard: [
    { rank: 1, name: "Aarav Patel", score: 1450 },
    { rank: 2, name: "Sneha Reddy", score: 1390 },
    { rank: 3, name: "Rudransh Pandey", score: 1320 },
    { rank: 4, name: "Vikram Malhotra", score: 1280 }
  ],
  notifications: [
    {
      id: "notif-01",
      title: "New Assessment Available",
      message: "Data Structures & Dynamic Programming has been assigned.",
      read: false,
      createdAt: "2026-08-28T09:00:00.000Z"
    },
    {
      id: "notif-02",
      title: "Assignment Graded",
      message: "Your submission for Node.js REST API scored 95/100.",
      read: true,
      createdAt: "2026-08-27T16:00:00.000Z"
    }
  ]
};