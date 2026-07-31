import { useCallback, useState } from "react";
import { updateLearningProgress } from "../services/learningModuleService";

/**
 * Hook for managing learning module progress updates.
 * Responsibilities: update lesson completion status, track updating state, cache last updated module.
 */
export function useLearningProgress() {
  const [updating, setUpdating] = useState(false);
  const [updatedModule, setUpdatedModule] = useState(null);

  /**
   * Mark a lesson as completed.
   *
   * @param {string} moduleId - The module id.
   * @param {string} lessonId - The lesson id.
   * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
   */
  const markLessonComplete = useCallback(async (moduleId, lessonId) => {
    return updateProgress(moduleId, lessonId, true);
  }, []);

  /**
   * Update progress for a specific lesson.
   *
   * @param {string} moduleId - The module id.
   * @param {string} lessonId - The lesson id.
   * @param {boolean} completed - Whether the lesson is completed.
   * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
   */
  const updateProgress = useCallback(async (moduleId, lessonId, completed) => {
    setUpdating(true);
    try {
      const result = await updateLearningProgress(moduleId, lessonId, completed);
      if (result.success) {
        setUpdatedModule(result.data);
      }
      return result;
    } catch (err) {
      return { success: false, data: null, error: err.message || "Failed to update progress" };
    } finally {
      setUpdating(false);
    }
  }, []);

  return {
    markLessonComplete,
    updateProgress,
    updating,
    updatedModule,
  };
}
