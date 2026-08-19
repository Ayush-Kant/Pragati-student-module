/**
 * useMilestones — fetches and manages milestone data for a project.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getMilestones } from '../services/projectService';
import {
  sortMilestonesByOrder,
  getMilestoneProgress,
  getActiveMilestone,
} from '../utils/milestoneHelpers';

/**
 * @param {string} projectId
 * @returns {{
 *   milestones: object[],
 *   activeMilestone: object | null,
 *   progress: { completed: number, total: number, percentage: number },
 *   isLoading: boolean,
 *   error: string | null,
 *   refetch: Function,
 * }}
 */
export function useMilestones(projectId) {
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState(null);

  const fetchMilestones = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMilestones(projectId);
      if (result.success) {
        setMilestones(sortMilestonesByOrder(result.data));
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to load milestones. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchMilestones();
    })();
    return () => { cancelled = true; };
  }, [fetchMilestones]);

  const progress = useMemo(() => getMilestoneProgress(milestones), [milestones]);
  const activeMilestone = useMemo(() => getActiveMilestone(milestones), [milestones]);

  return {
    milestones,
    activeMilestone,
    progress,
    isLoading,
    error,
    refetch: fetchMilestones,
  };
}
