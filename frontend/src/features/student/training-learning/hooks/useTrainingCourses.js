// useTrainingCourses.js
// Fetches course data and exposes search/filter state for the course listing UI

import { useState, useEffect, useCallback, useMemo } from "react";
import { getCourses } from "../services/trainingLearningService";
import { LOADING_STATES } from "../constants/trainingLearningConstants";
import { filterCourses } from "../utils/trainingLearningHelpers";
import { validateCourse } from "../validations/trainingLearningValidation";

const useTrainingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [status, setStatus] = useState("All");

  const fetchCourses = useCallback(async () => {
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);
    try {
      const data = await getCourses();

      // Drop any malformed course records before they reach the UI,
      // and surface a console warning so bad backend data is visible in dev.
      const validCourses = data.filter((course) => {
        const { valid, errors } = validateCourse(course);
        if (!valid) {
          console.warn(`Invalid course data (id: ${course?.id ?? "unknown"}):`, errors);
        }
        return valid;
      });

      setCourses(validCourses);
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      setError(err.message || "Failed to load courses");
      setLoadingState(LOADING_STATES.ERROR);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = useMemo(
    () => filterCourses(courses, { search, category, level, status }),
    [courses, search, category, level, status]
  );

  const continueLearningCourses = useMemo(
    () => courses.filter((c) => c.status === "In Progress"),
    [courses]
  );

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setLevel("All");
    setStatus("All");
  };

  return {
    courses: filteredCourses,
    allCourses: courses,
    continueLearningCourses,

    // filter state
    search,
    setSearch,
    category,
    setCategory,
    level,
    setLevel,
    status,
    setStatus,
    resetFilters,

    // states
    loading: loadingState === LOADING_STATES.LOADING,
    loadingState,
    error,

    refetch: fetchCourses,
  };
};

export default useTrainingCourses;
