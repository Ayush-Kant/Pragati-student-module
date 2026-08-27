export const mockDashboardData = {
  activeDrive: {
    driveId: "demo-drive-1",
    driveName: "TechCorp MERN Drive",
    companyName: "TechCorp",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    enrollmentStatus: "active"
  },
  quickStats: {
    xpEarned: 340,
    assignmentsCompleted: 5,
    sessionsAttended: 8,
    overallScore: 74.2
  },
  progressRing: {
    completionPercent: 62
  },
  upcomingSessions: [
    {
      sessionId: "session-1",
      title: "React Development Session",
      mentorName: "Priya Mehta",
      scheduledAt: "2026-06-20T10:00:00Z"
    },
    {
      sessionId: "session-2",
      title: "Project Review",
      mentorName: "Rahul Sharma",
      scheduledAt: "2026-06-22T14:00:00Z"
    }
  ],
  pendingTasks: [
    {
      taskId: "task-1",
      type: "assignment",
      title: "REST API Project",
      dueAt: "2026-06-20T23:59:00Z"
    },
    {
      taskId: "task-2",
      type: "assessment",
      title: "Aptitude Assessment",
      dueAt: "2026-06-21T23:59:00Z"
    }
  ],
  batchRank: {
    rank: 3,
    totalStudents: 28,
    percentile: 89
  },
  recentNotifications: [
    {
      id: "notification-1",
      title: "New assignment assigned",
      readAt: null
    },
    {
      id: "notification-2",
      title: "Grade released",
      readAt: "2026-06-19T10:00:00Z"
    }
  ]
};

export const mockLeaderboardData = [
  { rank: 1, studentName: "Riya S.", percentile: 96 },
  { rank: 2, studentName: "Karan P.", percentile: 91 },
  { rank: 3, studentName: "Current Student", percentile: 89, isSelf: true }
];