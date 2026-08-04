import { useState, useEffect, useCallback } from 'react';
import { getMilestones } from '../services/projectService';
import { calculateCompletionPercentage } from '../utils/projectHelpers';

export const useMilestones = (projectId) => {
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMilestones = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMilestones(projectId);
      setMilestones(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch project milestones.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const updateTaskProgress = (taskId, newStatus) => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((ms) => {
        let hasTask = false;
        const updatedTasks = ms.tasks.map((t) => {
          if (t.id === taskId) {
            hasTask = true;
            return { ...t, status: newStatus };
          }
          return t;
        });

        if (!hasTask) return ms;

        const newPercentage = calculateCompletionPercentage(updatedTasks);
        const allDone = updatedTasks.every((t) => t.status === 'done');
        const msStatus = allDone ? 'completed' : newPercentage > 0 ? 'in-progress' : 'todo';

        return {
          ...ms,
          tasks: updatedTasks,
          completionPercentage: newPercentage,
          status: msStatus,
        };
      })
    );
  };

  return {
    milestones,
    isLoading,
    error,
    updateTaskProgress,
    refetch: fetchMilestones,
  };
};
