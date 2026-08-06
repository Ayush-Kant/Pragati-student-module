import { useState, useEffect } from "react";
import { getAssessments } from "../services/assessmentService";

export const useAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAssessments()
      .then((data) => setAssessments(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { assessments, loading, error };
};