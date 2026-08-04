import { useState, useEffect, useCallback } from 'react';
import { submitProject as submitService, uploadProjectFiles as uploadService } from '../services/projectService';
import { dummySubmissions } from '../types/projectDummyData';

export const useProjectSubmission = (projectId) => {
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      // Load submission history for this project
      const history = dummySubmissions[projectId] || [];
      setSubmissionHistory([...history]);
      if (history.length > 0) {
        setSubmission(history[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load submission history.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const submitProject = async (payload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await submitService(projectId, payload);
      setSubmission(created);
      setSubmissionHistory((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err.message || 'Failed to submit project deliverable.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadFiles = async (files) => {
    try {
      const uploaded = await uploadService(projectId, files);
      return uploaded;
    } catch (err) {
      setError(err.message || 'Failed to process files upload.');
      throw err;
    }
  };

  return {
    submission,
    submissionHistory,
    isLoading,
    isSubmitting,
    error,
    submitProject,
    uploadFiles,
    refetch: fetchSubmissions,
  };
};
