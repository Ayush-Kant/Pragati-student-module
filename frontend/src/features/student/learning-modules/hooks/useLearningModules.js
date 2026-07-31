import { useCallback, useEffect, useState } from "react";
import { getLearningModules } from "../services/learningModuleService";

/**
 * Fetches and manages the list of learning modules.
 * Responsibilities: fetch module data, loading/error state, refetch support.
 */
export function useLearningModules() {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModules = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getLearningModules();
      if (result.success) {
        setModules(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch learning modules");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return {
    modules,
    isLoading,
    error,
    refetch: fetchModules,
  };
}
