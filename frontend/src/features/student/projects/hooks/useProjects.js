/**
 * useProjects — fetches and manages the student's project list.
 * Provides client-side filtering, search, and refetch support.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProjects } from '../services/projectService';
import { filterByStatus, searchProjects, computeProjectStats } from '../utils/projectHelpers';

/**
 * @returns {{
 *   projects: object[],
 *   filteredProjects: object[],
 *   stats: object,
 *   isLoading: boolean,
 *   error: string | null,
 *   searchQuery: string,
 *   statusFilter: string,
 *   setSearchQuery: Function,
 *   setStatusFilter: Function,
 *   refetch: Function,
 * }}
 */
export function useProjects() {
  const [projects, setProjects]     = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getProjects();
      if (result.success) {
        setProjects(result.data);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const result = await getProjects();
        if (!cancelled) {
          if (result.success) {
            setProjects(result.data);
          } else {
            setError(result.error);
          }
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load projects. Please try again.');
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
  }, []);

  const filteredProjects = useMemo(() => {
    let result = projects;
    result = filterByStatus(result, statusFilter);
    result = searchProjects(result, searchQuery);
    return result;
  }, [projects, statusFilter, searchQuery]);

  const stats = useMemo(() => computeProjectStats(projects), [projects]);

  return {
    projects,
    filteredProjects,
    stats,
    isLoading,
    error,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    refetch: fetchProjects,
  };
}
