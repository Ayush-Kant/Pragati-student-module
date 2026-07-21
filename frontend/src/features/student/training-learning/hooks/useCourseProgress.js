// useCourseProgress.js
// Fetches a course's details + progress and module-completion breakdown

import { useState, useEffect, useCallback } from "react";
import { getCourseById, getCourseProgress } from "../services/trainingLearningService";
import { LOADING_STATES } from "../constants/trainingLearningConstants";
import { getModuleCompletionPercent } from "../utils/trainingLearningHelpers";
import { validateCourse, validateProgress } from "../validations/trainingLearningValidation";

const useCourseProgress = (courseId) => {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchCourseProgress = useCallback(async () => {
    if (!courseId) return;
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);
    try {
      const [courseData, progressData] = await Promise.all([
        getCourseById(courseId),
        getCourseProgress(courseId),
      ]);

      const courseCheck = validateCourse(courseData);
      if (!courseCheck.valid) {
        console.warn(`Invalid course data (id: ${courseId}):`, courseCheck.errors);
      }

      const progressCheck = validateProgress(progressData?.progress);
      if (!progressCheck.valid) {
        console.warn(`Invalid progress value (courseId: ${courseId}):`, progressCheck.errors);
      }

      setCourse(courseData);
      setProgress(progressData);
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      setError(err.message || "Failed to load course progress");
      setLoadingState(LOADING_STATES.ERROR);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseProgress();
  }, [fetchCourseProgress]);

  const moduleCompletionPercent = course ? getModuleCompletionPercent(course) : 0;

  return {
    course,
    progress,
    moduleCompletionPercent,
    loading: loadingState === LOADING_STATES.LOADING,
    loadingState,
    error,
    refetch: fetchCourseProgress,
  };
};

export default useCourseProgress;
