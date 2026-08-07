import { useState, useEffect } from "react";
import { getAssessmentById } from "../services/assessmentService";

export const useAssessment = (id) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    getAssessmentById(id)
      .then((data) => setAssessment(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { assessment, loading, error };
};