/**
 * useProjectDetails — fetches a single project's data and manages tab state.
 */

import { useCallback, useEffect, useState } from 'react';
import { getProjectById } from '../services/projectService';
import { DETAIL_TABS } from '../constants/projectConstants';

/**
 * @param {string} projectId
 * @returns {{
 *   project: object | null,
 *   isLoading: boolean,
 *   error: string | null,
 *   activeTab: string,
 *   setActiveTab: Function,
 *   refetch: Function,
 * }}
 */
export function useProjectDetails(projectId) {
  const [project, setProject]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState(DETAIL_TABS[0].id);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getProjectById(projectId);
      if (result.success) {
        setProject(result.data);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to load project details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    const loadData = async () => {
      try {
        const result = await getProjectById(projectId);
        if (!cancelled) {
          if (result.success) {
            setProject(result.data);
          } else {
            setError(result.error);
          }
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load project details. Please try again.');
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

  return {
    project,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    refetch: fetchProject,
  };
}
