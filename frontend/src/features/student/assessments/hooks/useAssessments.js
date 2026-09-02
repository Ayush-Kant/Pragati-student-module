import { useEffect, useState } from "react";
import { getAssessments } from "../services/assessmentService";

export const useAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAssessments();
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.assessments)
            ? response.assessments
            : [];

        if (isMounted) setAssessments(list);
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || err?.message || "Failed to load assessments");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { assessments, loading, error };
};
