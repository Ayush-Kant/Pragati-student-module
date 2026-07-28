import { useState, useCallback } from 'react';
import * as projectService from '../services/projectService';

/**
 * Custom hook to handle final project submissions.
 * Prevents concurrent submissions and encapsulates progress states.
 */
export const useFinalProjectSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitFinalProject = useCallback(async (projectId, formData) => {
    if (loading) return; // Block double submissions in flight
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await projectService.submitFinalProject(projectId, formData);
      setSuccess(true);
      return result.data;
    } catch (err) {
      setError(err.message || 'Final project submission failed.');
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    submitFinalProject,
    loading,
    error,
    success,
    resetStatus,
  };
};
