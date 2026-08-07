import { useState, useEffect } from "react";
import { getAssessmentHistory } from "../services/assessmentService";

export const useAssessmentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssessmentHistory()
      .then((data) => setHistory(data))
      .finally(() => setLoading(false));
  }, []);

  return { history, loading };
};