import { useState } from 'react';

export const mockActivities = [
  {
    id: 1,
    title: "Frontend Dashboard Challenge",
    type: "assignment",
    dueAt: "2025-05-25T23:59:00Z",
    status: "pending",
    assignedCount: 24,
    submissionCount: 10
  },
  {
    id: 2,
    title: "SQL Basics Quiz",
    type: "quiz",
    dueAt: "2025-05-18T23:59:00Z",
    status: "completed",
    assignedCount: 32,
    submissionCount: 32
  },
  {
    id: 3,
    title: "System Design Case Study",
    type: "case_study",
    dueAt: null,
    status: "completed",
    assignedCount: 28,
    submissionCount: 28
  }
];

export const mockStats = {
  total: 128,
  completed: 45,
  pending: 28,
  drafts: 12,
  avgEngagement: 4.3
};

const useActivities = () => {
  const [activities, setActivities] = useState(mockActivities);
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Add filtering logic here

  return { activities, stats, loading, error };
};

export default useActivities;
