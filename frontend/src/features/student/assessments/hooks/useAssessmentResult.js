import { useEffect, useState } from "react";
import { getAssessmentResult } from "../services/assessmentService";

export const useAssessmentResult = (attemptId) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(Boolean(attemptId));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!attemptId) {
      setResult(null);
      setError("Attempt id is required");
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAssessmentResult(attemptId);
        if (isMounted) setResult(data);
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || err?.message || "Unable to load result");
          setResult(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  return { result, loading, error };
};
