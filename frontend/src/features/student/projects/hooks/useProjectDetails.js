import { useState, useEffect, useCallback } from "react";
import { projectService } from "../services/projectService";

export const useProjectDetails = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectDetails = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjectById(projectId);
      setProject(data);
    } catch (err) {
      setError(err.message || "Failed to fetch project details.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  return {
    project,
    loading,
    error,
    refetch: fetchProjectDetails,
  };
};
