import { useState, useEffect } from "react";
import { getAssessmentResult } from "../services/assessmentService";

export const useAssessmentResult = (attemptId) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssessmentResult(attemptId)
      .then((data) => setResult(data))
      .finally(() => setLoading(false));
  }, [attemptId]);

  return { result, loading };
};