// useLearningResources.js
// Fetches the learning resources (materials, notes, downloads) for a course

import { useState, useEffect, useCallback } from "react";
import { getLearningResources } from "../services/trainingLearningService";
import { LOADING_STATES } from "../constants/trainingLearningConstants";
import { validateResources } from "../validations/trainingLearningValidation";

const useLearningResources = (courseId) => {
  const [resources, setResources] = useState([]);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchResources = useCallback(async () => {
    if (!courseId) return;
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);
    try {
      const data = await getLearningResources(courseId);

      const validResources = data.filter((resource) => {
        const { valid, errors } = validateResources(resource);
        if (!valid) {
          console.warn(`Invalid resource data (id: ${resource?.id ?? "unknown"}):`, errors);
        }
        return valid;
      });

      setResources(validResources);
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      setError(err.message || "Failed to load learning resources");
      setLoadingState(LOADING_STATES.ERROR);
    }
  }, [courseId]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return {
    resources,
    loading: loadingState === LOADING_STATES.LOADING,
    loadingState,
    error,
    refetch: fetchResources,
  };
};

export default useLearningResources;
