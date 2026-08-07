import { useState, useCallback } from 'react';
import * as projectService from '../services/projectService';

/**
 * Custom hook to manage and fetch pragati projects.
 * Encapsulates listing, detail retrieval, and state synchronizations.
 */
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await projectService.getProjects();
      setProjects(result.data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve projects list.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectById = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await projectService.getProjectById(projectId);
      setProject(result.data);
      return result.data;
    } catch (err) {
      setError(err.message || `Failed to fetch project details for ${projectId}.`);
      setProject(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    projects,
    project,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
    setProject,
  };
};
