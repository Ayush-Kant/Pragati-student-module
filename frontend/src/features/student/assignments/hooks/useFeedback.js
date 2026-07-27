import { useState } from "react";
import { getFeedback, getGrades } from "../services/assignmentService";
import { ERROR_MESSAGES } from "../constants/assignmentConstants";

const useFeedback = () => {
  const [feedback, setFeedback] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFeedback = async (id) => {
    try {
      setLoading(true);
      setError("");

      const response = await getFeedback(id);

      if (response.success) {
        setFeedback(response.data);
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

  const fetchGrades = async (id) => {
    try {
      setLoading(true);
      setError("");

      const response = await getGrades(id);;

      if (response.success) {
        setGrades(response.data);
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
    feedback,
    grades,
    loading,
    error,
    fetchFeedback,
    fetchGrades,
  };
};

export default useFeedback;