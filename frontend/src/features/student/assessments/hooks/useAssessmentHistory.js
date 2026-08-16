import { useState, useEffect } from "react";
import { getAssessmentHistory } from "../services/assessmentService";

export const useAssessmentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAssessmentHistory()
      .then((data) => {
        if (isMounted) setHistory(data);
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
  }, []);

  return { history, loading, error };
};