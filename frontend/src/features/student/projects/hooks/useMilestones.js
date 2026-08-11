import { useState, useEffect, useCallback } from "react";
import { projectService } from "../services/projectService";

export const useMilestones = (projectId) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMilestones = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjectMilestones(projectId);
      setMilestones(data);
    } catch (err) {
      setError(err.message || "Failed to fetch milestones.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const toggleTaskChecklist = (milestoneId, taskId, checklistId) => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((m) => {
        if (m.id !== milestoneId) return m;
        const updatedTasks = m.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const updatedChecklist = t.checklist.map((c) =>
            c.id === checklistId ? { ...c, completed: !c.completed } : c
          );
          const allCompleted = updatedChecklist.every((c) => c.completed);
          return {
            ...t,
            checklist: updatedChecklist,
            status: allCompleted ? "COMPLETED" : "IN_PROGRESS",
          };
        });

        // Recalculate milestone progress
        const totalTasks = updatedTasks.length;
        const completedTasks = updatedTasks.filter((t) => t.status === "COMPLETED").length;
        const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const status = progressPercent === 100 ? "COMPLETED" : progressPercent > 0 ? "IN_PROGRESS" : "NOT_STARTED";

        return {
          ...m,
          tasks: updatedTasks,
          progressPercent,
          status,
        };
      })
    );
  };

  return {
    milestones,
    loading,
    error,
    refetch: fetchMilestones,
    toggleTaskChecklist,
  };
};
