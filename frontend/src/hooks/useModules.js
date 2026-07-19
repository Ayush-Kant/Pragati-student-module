import { useState } from "react";
import { moduleService } from "../services/moduleService";

export function useModules() {
  const [moduleLoading, setModuleLoading] = useState(false);
  const [moduleError, setModuleError] = useState(null);

  const handleAddModule = async (courseId, title, orderIndex) => {
    setModuleLoading(true);
    setModuleError(null);
    try {
      const newModule = await moduleService.addModule(
        courseId,
        title,
        orderIndex,
      );
      return newModule;
    } catch (err) {
      setModuleError(
        err.response?.data?.message ||
          "Failed to insert structural course section.",
      );
      throw err;
    } finally {
      setModuleLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    setModuleLoading(true);
    setModuleError(null);
    try {
      await moduleService.deleteModule(moduleId);
      return true;
    } catch (err) {
      setModuleError(
        err.response?.data?.message ||
          "Failed to purge section node module asset.",
      );
      throw err;
    } finally {
      setModuleLoading(false);
    }
  };

  const handleReorderLessons = async (moduleId, lessonOrderArray) => {
    setModuleLoading(true);
    setModuleError(null);
    try {
      // Re-map localized ordering models into back-end verification parameters
      // Array standard pattern schema: [{ lessonId, orderIndex }]
      const result = await moduleService.reorderLessons(
        moduleId,
        lessonOrderArray,
      );
      return result;
    } catch (err) {
      setModuleError(
        err.response?.data?.message ||
          "Failed to store sequential positioning orders.",
      );
      throw err;
    } finally {
      setModuleLoading(false);
    }
  };

  const handleReorderModules = async (courseId, moduleOrderArray) => {
    setModuleLoading(true);
    setModuleError(null);
    try {
      // Array standard schema: [{ id, orderIndex }]
      const result = await moduleService.reorderModules(
        courseId,
        moduleOrderArray,
      );
      return result;
    } catch (err) {
      setModuleError(
        err.response?.data?.message || "Failed to update section layout.",
      );
      throw err;
    } finally {
      setModuleLoading(false);
    }
  };

  return {
    moduleLoading,
    moduleError,
    handleAddModule,
    handleDeleteModule,
    handleReorderLessons,
    handleReorderModules,
  };
}
