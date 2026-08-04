import { useState, useEffect, useCallback } from 'react';
import { getProjectById, getProjectFeedback } from '../services/projectService';

export const useProjectDetails = (projectId) => {
  const [project, setProject] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectDetails = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [projData, feedbackData] = await Promise.all([
        getProjectById(projectId),
        getProjectFeedback(projectId),
      ]);
      setProject(projData);
      setFeedback(feedbackData);
    } catch (err) {
      setError(err.message || 'Failed to fetch project details.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  return {
    project,
    feedback,
    isLoading,
    error,
    refetch: fetchProjectDetails,
  };
};
