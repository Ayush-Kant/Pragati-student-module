import { useState, useCallback } from 'react';
import * as projectService from '../services/projectService';

/**
 * Custom hook to handle milestone check-in submissions.
 * Prevents double submission and handles status and response states.
 */
export const useMilestoneSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitMilestone = useCallback(async (projectId, milestoneId, payload) => {
    if (loading) return; // Prevent concurrent duplicate submissions
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await projectService.submitMilestone(projectId, milestoneId, payload);
      setSuccess(true);
      return result.data;
    } catch (err) {
      setError(err.message || 'Submission failed.');
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
    submitMilestone,
    loading,
    error,
    success,
    resetStatus,
  };
};
