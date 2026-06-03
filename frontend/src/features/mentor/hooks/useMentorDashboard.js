import { useState, useEffect } from "react";
import { useActivityContext } from '../context/ActivityContext';

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
  const { activities } = useActivityContext ? useActivityContext() : { activities: [] };
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // derive menteesProgress from activities
      const totalAssigned = activities?.reduce((sum, a) => sum + (a.assignedCount || 0), 0) || 0;

      // If no assigned data, fallback to mock
      if (!activities || activities.length === 0 || totalAssigned === 0) {
        setData(mockDashboard);
        setLoading(false);
        return;
      }

      // compute estimated completed count per activity
      const completionCounts = activities.map(a => {
        const assigned = a.assignedCount || 0;
        const submitted = a.submissionCount || 0;
        const completed = Math.min(assigned, submitted);
        const completionRate = assigned > 0 ? completed / assigned : 0;
        return { assigned, completed, completionRate };
      });

      // Aggregate mentee counts into buckets weighted by assigned counts
      const buckets = {
        Excellent: 0,
        Good: 0,
        Average: 0,
        'Needs Improvement': 0
      };

      completionCounts.forEach(cc => {
        const weight = cc.assigned;
        const pct = cc.completionRate;
        if (pct >= 0.8) buckets.Excellent += weight;
        else if (pct >= 0.6) buckets.Good += weight;
        else if (pct >= 0.4) buckets.Average += weight;
        else buckets['Needs Improvement'] += weight;
      });

      const totalInBuckets = Object.values(buckets).reduce((s, v) => s + v, 0) || 1;

      const menteesProgress = [
        { name: 'Excellent', value: buckets.Excellent, percent: Math.round((buckets.Excellent / totalInBuckets) * 100) },
        { name: 'Good', value: buckets.Good, percent: Math.round((buckets.Good / totalInBuckets) * 100) },
        { name: 'Average', value: buckets.Average, percent: Math.round((buckets.Average / totalInBuckets) * 100) },
        { name: 'Needs Improvement', value: buckets['Needs Improvement'], percent: Math.round((buckets['Needs Improvement'] / totalInBuckets) * 100) }
      ];

      const newDashboard = {
        ...mockDashboard,
        menteesProgress,
        // Optionally update totals based on activities
        totalMentees: mockDashboard.totalMentees,
      };

      setData(newDashboard);
      setLoading(false);
    } catch (err) {
      setError('Failed to compute dashboard data');
      setData(mockDashboard);
      setLoading(false);
    }
  }, [activities]);

  return { data, loading, error };
};

export default useMentorDashboard;