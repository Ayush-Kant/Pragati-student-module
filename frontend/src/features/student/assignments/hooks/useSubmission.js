import { useState } from "react";
import {
  submitAssignment,
  updateSubmission,
  getSubmissionHistory,
} from "../services/assignmentService";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants/assignmentConstants";

const useSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmitAssignment = async (id, submissionData) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await submitAssignment(id, submissionData);

      if (response.success) {
        setMessage(SUCCESS_MESSAGES.SUBMISSION_SUCCESS);
      } else {
        setError(ERROR_MESSAGES.SUBMISSION_FAILED);
      }

      return response;
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmission = async (id, submissionData) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await updateSubmission(id, submissionData);

      if (response.success) {
        setMessage(SUCCESS_MESSAGES.SUBMISSION_UPDATED);
      } else {
        setError(ERROR_MESSAGES.SUBMISSION_FAILED);
      }

      return response;
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionHistory = async (id) => {
    try {
      setLoading(true);
      setError("");

      const response = await getSubmissionHistory(id);

      if (response.success) {
        setSubmissionHistory(response.data);
      } else {
        setError(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
      }

      return response;
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submissionHistory,
    message,
    error,
    handleSubmitAssignment,
    handleUpdateSubmission,
    fetchSubmissionHistory,
  };
};

export default useSubmission;