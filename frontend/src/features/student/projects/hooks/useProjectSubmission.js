/**
 * useProjectSubmission — full submission workflow state machine.
 * Coordinates validation → upload state → submit → history.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  getProjectSubmission,
  submitProject,
  getSubmissionHistory,
} from '../services/projectService';
import { validateSubmissionPayload } from '../validations/projectValidation';
import { getUploadedFileIds } from '../utils/submissionHelpers';
import { SUBMISSION_STATE } from '../constants/projectConstants';

/**
 * @param {string} projectId
 * @param {object[]} fileEntries — from useProjectUpload
 * @returns {{
 *   submission: object | null,
 *   history: object[],
 *   submissionState: string,
 *   formErrors: string[],
 *   isLoading: boolean,
 *   error: string | null,
 *   submit: (payload: object) => Promise<void>,
 *   refetch: Function,
 * }}
 */
export function useProjectSubmission(projectId, fileEntries = []) {
  const [submission, setSubmission]       = useState(null);
  const [history, setHistory]             = useState([]);
  const [submissionState, setSubmissionState] = useState(SUBMISSION_STATE.DRAFT);
  const [formErrors, setFormErrors]       = useState([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [error, setError]                 = useState(null);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [subResult, histResult] = await Promise.all([
        getProjectSubmission(projectId),
        getSubmissionHistory(projectId),
      ]);

      if (subResult.success) {
        setSubmission(subResult.data);
        if (subResult.data?.status) {
          setSubmissionState(subResult.data.status);
        }
      } else {
        setError(subResult.error);
      }

      if (histResult.success) {
        setHistory(histResult.data);
      }
    } catch {
      setError('Failed to load submission data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchData();
    })();
    return () => { cancelled = true; };
  }, [fetchData]);

  const submit = useCallback(
    async (payload) => {
      // Validate
      setSubmissionState(SUBMISSION_STATE.VALIDATING);
      setFormErrors([]);

      const validation = validateSubmissionPayload(payload);
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        setSubmissionState(SUBMISSION_STATE.DRAFT);
        return;
      }

      // Transition to ready (upload already handled by useProjectUpload)
      setSubmissionState(SUBMISSION_STATE.READY);

      // Collect uploaded file IDs
      const fileIds = getUploadedFileIds(fileEntries);

      // Submit
      setSubmissionState(SUBMISSION_STATE.SUBMITTING);
      try {
        const result = await submitProject(projectId, { ...payload, fileIds });
        if (result.success) {
          setSubmission(result.data);
          setSubmissionState(SUBMISSION_STATE.SUBMITTED);
          // Refresh history
          const histResult = await getSubmissionHistory(projectId);
          if (histResult.success) setHistory(histResult.data);
        } else {
          setError(result.error);
          setSubmissionState(SUBMISSION_STATE.DRAFT);
        }
      } catch {
        setError('Submission failed. Please try again.');
        setSubmissionState(SUBMISSION_STATE.DRAFT);
      }
    },
    [projectId, fileEntries]
  );

  return {
    submission,
    history,
    submissionState,
    formErrors,
    isLoading,
    error,
    submit,
    refetch: fetchData,
  };
}
