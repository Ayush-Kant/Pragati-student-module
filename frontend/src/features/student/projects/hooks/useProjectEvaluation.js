/**
 * useProjectEvaluation — fetches evaluation data for a project.
 */

import { useCallback, useEffect, useState } from 'react';
import { getProjectEvaluation } from '../services/projectService';

/**
 * @param {string} projectId
 * @returns {{
 *   evaluation: object | null,
 *   isLoading: boolean,
 *   error: string | null,
 *   refetch: Function,
 * }}
 */
export function useProjectEvaluation(projectId) {
  const [evaluation, setEvaluation] = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState(null);

  const fetchEvaluation = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getProjectEvaluation(projectId);
      if (result.success) {
        setEvaluation(result.data);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to load evaluation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    const loadData = async () => {
      try {
        const result = await getProjectEvaluation(projectId);
        if (!cancelled) {
          if (result.success) {
            setEvaluation(result.data);
          } else {
            setError(result.error);
          }
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load evaluation. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    setError(null);
    loadData();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return { evaluation, isLoading, error, refetch: fetchEvaluation };
}
