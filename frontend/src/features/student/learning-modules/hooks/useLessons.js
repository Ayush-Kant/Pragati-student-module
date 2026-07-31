import { useState, useEffect, useCallback } from "react";
import { getModuleById, updateLearningProgress } from "../services/learningModuleService";

/**
 * Hook for fetching and managing a single learning module's lessons.
 *
 * @param {string} moduleId - The module id.
 * @returns {object} Module state and actions.
 */
export function useLessons(moduleId) {
  const [module, setModule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModule = useCallback(async () => {
    if (!moduleId) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await getModuleById(moduleId);
      if (result.success) {
        setModule(result.data);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Failed to fetch module details");
    } finally {
      setIsLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  const toggleLessonComplete = useCallback(async (lessonId, completed) => {
    if (!moduleId) return { success: false, error: "Missing moduleId" };
    const result = await updateLearningProgress(moduleId, lessonId, completed);
    if (result.success) {
      setModule(result.data);
    }
    return result;
  }, [moduleId]);

  return {
    module,
    isLoading,
    error,
    refetch: fetchModule,
    toggleLessonComplete,
  };
}
