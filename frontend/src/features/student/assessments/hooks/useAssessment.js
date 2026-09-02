import { useEffect, useState } from "react";
import { getAssessmentById } from "../services/assessmentService";

const normalizeAssessment = (assessment) => ({
  ...assessment,
  category: assessment?.type,
  description: assessment?.description || `${assessment?.type || "Assessment"} assessment at ${assessment?.difficulty || "standard"} difficulty.`,
  durationMinutes: assessment?.timeLimitMinutes,
  totalQuestions: assessment?.questions?.length || 0,
  questions: (assessment?.questions || []).map((question) => ({
    ...question,
    text: question?.text || question?.questionText,
  })),
});

export const useAssessment = (id) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setAssessment(null);
      setError("Assessment id is required");
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAssessmentById(id);
        if (isMounted) setAssessment(normalizeAssessment(data));
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || err?.message || "Failed to load assessment");
          setAssessment(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return { assessment, loading, error };
};
