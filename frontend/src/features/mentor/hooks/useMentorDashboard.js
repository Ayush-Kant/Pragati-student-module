import { useState, useEffect } from 'react';

export const useMentorDashboard = () => {
  const [data, setData] = useState({
    stats: {
      totalMentees: 48,
      activeSessions: 16,
      assignmentsDue: 24,
      tasksAssigned: 36,
      placementProgress: 72
    },
    progressOverview: {
      excellent: 12,
      good: 19,
      average: 11,
      needsImprovement: 6
    },
    domains: [
      { name: 'Web Development', count: 16, color: '#3b82f6' },
      { name: 'UI/UX Design', count: 12, color: '#10b981' },
      { name: 'Data Science', count: 8, color: '#f59e0b' },
      { name: 'Digital Marketing', count: 7, color: '#ec4899' },
      { name: 'Others', count: 5, color: '#8b5cf6' }
    ],
    upcomingSessions: [
      { id: 1, topic: 'UI/UX Design Review', mentor: 'Riya Sharma', time: '10:00 AM', date: '20 May, 2026' },
      { id: 2, topic: 'Mock Interview', mentor: 'Arjun Verma', time: '02:30 PM', date: '21 May, 2026' },
      { id: 3, topic: 'Career Guidance', mentor: 'Neha Patel', time: '11:15 AM', date: '22 May, 2026' }
    ],
    leaderboard: [
      { id: 1, name: 'Riya Sharma', domain: 'UI/UX Design', score: 92 },
      { id: 2, name: 'Anjali Verma', domain: 'Web Development', score: 89 },
      { id: 3, name: 'Neha Patel', domain: 'Data Science', score: 87 }
    ],
    notifications: [
      { id: 1, text: 'Riya Sharma completed assignment 2', time: '5 mins ago' },
      { id: 2, text: 'Anjali Verma submitted project proposal', time: '1 hour ago' },
      { id: 3, text: 'Karan Singh completed mock review', time: '2 hours ago' }
    ]
  });

  return { data, loading: false, error: null };
};