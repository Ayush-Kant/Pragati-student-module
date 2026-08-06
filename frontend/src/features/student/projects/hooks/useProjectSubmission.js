import { useState, useEffect, useCallback } from "react";
import { projectService } from "../services/projectService";
import { validateSubmissionForm } from "../validations/projectValidation";

export const useProjectSubmission = (projectId) => {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    if (!projectId) return;
    try {
      setHistoryLoading(true);
      const data = await projectService.getProjectSubmissions(projectId);
      setSubmissions(data);
    } catch (err) {
      console.error("Failed to fetch submission history", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const submitProjectWork = async (formData, files = []) => {
    try {
      setSubmitting(true);
      setError(null);
      setValidationErrors({});

      // Validate inputs
      const { isValid, errors } = validateSubmissionForm(formData, files);
      if (!isValid) {
        setValidationErrors(errors);
        setSubmitting(false);
        return false;
      }

      let uploadedFileList = [];
      if (files.length > 0) {
        setUploading(true);
        uploadedFileList = await projectService.uploadProjectFiles(projectId, files);
        setUploading(false);
      }

      const result = await projectService.submitProject(projectId, {
        ...formData,
        files: uploadedFileList,
      });

      setSubmittedData(result);
      setSubmissions((prev) => [result, ...prev]);
      return result;
    } catch (err) {
      setError(err.message || "Failed to submit project work.");
      return false;
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return {
    submitProjectWork,
    submitting,
    uploading,
    error,
    validationErrors,
    submittedData,
    submissions,
    historyLoading,
    refetchHistory: fetchSubmissions,
  };
};
