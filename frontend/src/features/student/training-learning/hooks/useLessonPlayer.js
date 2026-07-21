// useLessonPlayer.js
// Fetches lessons for a course, tracks the active lesson, and handles
// marking lessons complete + navigating to the next lesson

import { useState, useEffect, useCallback, useMemo } from "react";
import { getLessons, getLessonDetails, updateLessonProgress } from "../services/trainingLearningService";
import { LOADING_STATES } from "../constants/trainingLearningConstants";
import { groupLessonsByModule, getNextLesson } from "../utils/trainingLearningHelpers";
import { validateLesson } from "../validations/trainingLearningValidation";

const useLessonPlayer = (courseId, initialLessonId = null) => {
  const [lessons, setLessons] = useState([]);
  const [activeLessonId, setActiveLessonId] = useState(initialLessonId);
  const [activeLessonDetail, setActiveLessonDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchLessons = useCallback(async () => {
    if (!courseId) return;
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);
    try {
      const data = await getLessons(courseId);
      setLessons(data);
      setActiveLessonId((prev) => prev ?? data[0]?.id ?? null);
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      setError(err.message || "Failed to load lessons");
      setLoadingState(LOADING_STATES.ERROR);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Fetch and validate the full lesson record whenever the active lesson changes.
  // Falls back to the summary from `lessons` (already in hand) while the detail loads,
  // so the player never has to show a blank state on lesson switch.
  useEffect(() => {
    if (!courseId || !activeLessonId) {
      setActiveLessonDetail(null);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);

    getLessonDetails(courseId, activeLessonId)
      .then((detail) => {
        if (cancelled) return;
        const { valid, errors } = validateLesson(detail);
        if (!valid) {
          console.warn(`Invalid lesson data (id: ${activeLessonId}):`, errors);
          setActiveLessonDetail(null);
          return;
        }
        setActiveLessonDetail(detail);
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn(`Failed to load lesson details (id: ${activeLessonId}):`, err.message);
          setActiveLessonDetail(null);
        }
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [courseId, activeLessonId]);

  const activeLesson = useMemo(() => {
    const summary = lessons.find((l) => l.id === activeLessonId) || null;
    // Prefer the freshly validated detail record; fall back to the list summary.
    return activeLessonDetail || summary;
  }, [lessons, activeLessonId, activeLessonDetail]);

  const modules = useMemo(() => groupLessonsByModule(lessons), [lessons]);

  const selectLesson = (lessonId) => setActiveLessonId(lessonId);

  const markLessonComplete = useCallback(
    async (lessonId = activeLessonId) => {
      if (!lessonId) return;
      await updateLessonProgress(lessonId, { completed: true });
      setLessons((prev) => prev.map((l) => (l.id === lessonId ? { ...l, completed: true } : l)));
      setActiveLessonDetail((prev) => (prev && prev.id === lessonId ? { ...prev, completed: true } : prev));
    },
    [activeLessonId]
  );

  const goToNextLesson = useCallback(() => {
    const next = getNextLesson(lessons, activeLessonId) || lessons[lessons.findIndex((l) => l.id === activeLessonId) + 1];
    if (next) setActiveLessonId(next.id);
    return next;
  }, [lessons, activeLessonId]);

  return {
    lessons,
    modules,
    activeLesson,
    activeLessonId,
    detailLoading,
    selectLesson,
    markLessonComplete,
    goToNextLesson,
    loading: loadingState === LOADING_STATES.LOADING,
    loadingState,
    error,
    refetch: fetchLessons,
  };
};

export default useLessonPlayer;
