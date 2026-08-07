import { useState, useEffect } from "react";
import { getAssessments } from "../services/assessmentService";

export const useAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAssessments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAssessments();

        // Safely extract array from flat array or nested response object
        let dataList = [];
        if (Array.isArray(response)) {
          dataList = response;
        } else if (response && Array.isArray(response.assessments)) {
          dataList = response.assessments;
        } else if (response && Array.isArray(response.data)) {
          dataList = response.data;
        }

        if (isMounted) {
          setAssessments(dataList);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to fetch assessments");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAssessments();

    return () => {
      isMounted = false;
    };
  }, []);

  return { assessments, loading, error };
};