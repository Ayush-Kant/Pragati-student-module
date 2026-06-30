import { useState, useEffect } from "react";

const mockDashboard = {
  activeDrives: 3,
  pendingReviews: 7,
  totalMentees: 48,
  activeSessions: 16,
  assessments: 24,
  tasksAssigned: 36,
  placementProgress: 9,
  upcomingSessions: [
    { sessionId: "ses_01", title: "UI/UX Design Session", scheduledAt: "2025-05-24T11:00:00Z" },
    { sessionId: "ses_02", title: "Mock Interview", scheduledAt: "2025-05-24T12:00:00Z" },
    { sessionId: "ses_03", title: "Career Guidance", scheduledAt: "2025-05-25T10:00:00Z" }
  ],
  topStudents: [
    { studentId: "std_01", name: "Riya Sharma", domain: "UI/UX Design", readinessScore: 92 },
    { studentId: "std_02", name: "Arjun Verma", domain: "Web Development", readinessScore: 89 },
    { studentId: "std_03", name: "Neha Patel", domain: "Data Science", readinessScore: 87 },
    { studentId: "std_04", name: "Ravi Kumar", readinessScore: 74 },
    { studentId: "std_05", name: "Ananya Singh", readinessScore: 70 }
  ],
  recentNotifications: [
    { type: "submission", message: "Riya Sharma completed assessment" },
    { type: "review", message: "Arjun Verma submitted project Portfolio Website" },
    { type: "session", message: "Karan Patel joined session" },
    { type: "submission", message: "Karan Singh completed task Resume Optimization" }
  ],
  menteesByDomain: [
    { domain: "Web Development", count: 16 },
    { domain: "UI/UX Design", count: 12 },
    { domain: "Average", count: 12 },
    { domain: "Data Science", count: 8 },
    { domain: "Digital Marketing", count: 5 }
  ],
  jobReadinessScore: 72,
  menteesProgress: [
    { name: "Excellent", value: 12, percent: 25 },
    { name: "Good", value: 18, percent: 37 },
    { name: "Average", value: 12, percent: 25 },
    { name: "Needs Improvement", value: 6, percent: 13 }
  ]
};

const useMentorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(mockDashboard);
    setLoading(false);
  }, []);

  return { data, loading, error };
};

export default useMentorDashboard;