/**
 * PLACEHOLDER — TEAM LEAD CONTRACT CONTRACT (DO NOT FORK/REPLICATE)
 * Built by Frontend Owner (@musthafa-cse) to satisfy development verification.
 * Team Lead (@bhavyachawda07) to finalize and override.
 */

export const dashboardData = {
  student: {
    id: 'std_9082',
    name: 'Alex Mercer',
    email: 'alex.mercer@academy.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    level: 4,
    grade: 'A-',
    profileCompletion: 85,
    major: 'Computer Science'
  },
  statistics: {
    totalXP: 4750,
    nextLevelXP: 6000,
    rank: 12,
    totalStudents: 140,
    attendanceRate: 94,
    completedCourses: 3,
    activeCourses: 4,
    studyTimeThisWeekHours: 14.5
  },
  progress: {
    courseProgress: [
      { id: 'c1', title: 'Advanced React Architecture', progress: 78, totalModules: 12, completedModules: 9, instructor: 'Dr. Sarah Connor' },
      { id: 'c2', title: 'Data Structures & Algorithms', progress: 45, totalModules: 10, completedModules: 4, instructor: 'Prof. Charles Xavier' },
      { id: 'c3', title: 'Database Systems (SQL & NoSQL)', progress: 90, totalModules: 8, completedModules: 7, instructor: 'Dr. Bruce Banner' },
      { id: 'c4', title: 'UI/UX Design Systems', progress: 20, totalModules: 15, completedModules: 3, instructor: 'Elena Rostova' }
    ],
    moduleProgress: {
      currentModuleName: 'State Management & Custom Hooks',
      courseTitle: 'Advanced React Architecture',
      percentage: 65
    },
    xp: {
      current: 4750,
      target: 6000,
      percentage: 79,
      history: [
        { day: 'Mon', xp: 200 },
        { day: 'Tue', xp: 350 },
        { day: 'Wed', xp: 150 },
        { day: 'Thu', xp: 500 },
        { day: 'Fri', xp: 400 },
        { day: 'Sat', xp: 100 },
        { day: 'Sun', xp: 250 }
      ]
    }
  },
  attendance: {
    rate: 94,
    totalClasses: 48,
    present: 45,
    absent: 2,
    excused: 1,
    history: [
      { month: 'Mar', rate: 98 },
      { month: 'Apr', rate: 95 },
      { month: 'May', rate: 92 },
      { month: 'Jun', rate: 94 }
    ]
  },
  performance: {
    gpa: 3.82,
    rank: 12,
    previousRank: 15,
    scores: [
      { id: 's1', subject: 'React Architecture', type: 'Quiz 3', value: 92, date: '2026-07-10T10:00:00Z' },
      { id: 's2', subject: 'Data Structures', type: 'Midterm', value: 85, date: '2026-07-08T14:00:00Z' },
      { id: 's3', subject: 'Database Systems', type: 'Assignment 4', value: 98, date: '2026-07-05T23:59:00Z' },
      { id: 's4', subject: 'UI/UX Design', type: 'Quiz 1', value: 78, date: '2026-07-02T09:30:00Z' }
    ],
    trend: [
      { week: 'W1', gpa: 3.65 },
      { week: 'W2', gpa: 3.70 },
      { week: 'W3', gpa: 3.75 },
      { week: 'W4', gpa: 3.82 }
    ]
  },
  upcomingActivities: [
    { id: 'ua1', title: 'React Performance Tuning Lecture', date: '2026-07-17T09:00:00Z', type: 'CLASS', duration: '90 mins', instructor: 'Dr. Sarah Connor' },
    { id: 'ua2', title: 'Data Structures Assignment 3 Submission', date: '2026-07-18T23:59:00Z', type: 'ASSIGNMENT', urgency: 'high' },
    { id: 'ua3', title: 'Database Normalization Exam', date: '2026-07-20T11:00:00Z', type: 'EXAM', duration: '120 mins' },
    { id: 'ua4', title: 'AI & Web Dev Guest Lecture', date: '2026-07-22T15:00:00Z', type: 'WEBINAR', duration: '60 mins' }
  ],
  recentActivities: [
    { id: 'ra1', title: 'Completed Custom Hooks Exercise', date: '2026-07-16T15:30:00Z', type: 'STUDY_SESSION', xpGained: 150 },
    { id: 'ra2', title: 'Submitted Database Assignment 4', date: '2026-07-15T21:40:00Z', type: 'ASSIGNMENT', xpGained: 200 },
    { id: 'ra3', title: 'Attended Algorithms Live Session', date: '2026-07-14T14:00:00Z', type: 'CLASS', xpGained: 50 },
    { id: 'ra4', title: 'Scored 92% in React Architecture Quiz 3', date: '2026-07-10T10:30:00Z', type: 'EXAM', xpGained: 300 }
  ],
  notifications: [
    { id: 'n1', title: 'New Module Available', message: 'Module 5: React Fiber Deep-dive has been unlocked.', type: 'INFO', date: '2026-07-16T08:00:00Z', isRead: false },
    { id: 'n2', title: 'Assignment Deadline Approaching', message: 'Data Structures Assignment 3 is due in 48 hours.', type: 'DEADLINE', date: '2026-07-16T12:00:00Z', isRead: false },
    { id: 'n3', title: 'System Maintenance Scheduled', message: 'The portal will be down for 2 hours on Sunday at 02:00 AM UTC.', type: 'WARNING', date: '2026-07-15T18:00:00Z', isRead: true },
    { id: 'n4', title: 'Grade Published', message: 'Your grade for React Architecture Quiz 3 is now available (92%).', type: 'SUCCESS', date: '2026-07-10T10:45:00Z', isRead: true }
  ]
};

export const dashboardApiResponse = {
  success: true,
  data: dashboardData
};
