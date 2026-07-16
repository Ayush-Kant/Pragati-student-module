import { useState, useCallback } from "react";
import { courseService } from "../services/courseService";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getCourses(filters);
      setCourses(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch course lists.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourseById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getCourseById(id);
      setCurrentCourse(data);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch course specifications.",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateCourse = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const newCourseMetadata = await courseService.createCourse(formData);
      return newCourseMetadata; // Return tracking IDs: { courseId, firstModuleId }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to initialize course asset.",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (id, patchData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedData = await courseService.updateCourse(id, patchData);
      setCurrentCourse(updatedData);
      return updatedData;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update course properties.",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveCourse = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await courseService.archiveCourse(id);
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Archived" } : c)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to archive course node.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    currentCourse,
    loading,
    error,
    fetchCourses,
    fetchCourseById,
    handleCreateCourse,
    handleUpdateCourse,
    handleArchiveCourse,
  };
}
