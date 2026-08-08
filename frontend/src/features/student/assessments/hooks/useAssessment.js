import { useState, useEffect } from "react";
import { getAssessmentById } from "../services/assessmentService";

export const useAssessment = (id) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getAssessmentById(id)
      .then((data) => {
        if (isMounted) setAssessment(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { assessment, loading, error };
};