import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCodingChallenges } from '../services/codingChallengeService';
import {
  filterByDifficulty,
  filterByStatus,
  filterByTopic,
  searchChallenges,
} from '../utils/codingChallengeHelpers';

/**
 * Fetches and manages the list of coding challenges.
 * Provides client-side filtering, search, and refetch support.
 *
 * @returns {{
 *   challenges: object[],
 *   filteredChallenges: object[],
 *   isLoading: boolean,
 *   error: string | null,
 *   searchQuery: string,
 *   difficultyFilter: string,
 *   topicFilter: string,
 *   statusFilter: string,
 *   setSearchQuery: Function,
 *   setDifficultyFilter: Function,
 *   setTopicFilter: Function,
 *   setStatusFilter: Function,
 *   refetch: Function,
 * }}
 */
export function useCodingChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchChallenges = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getCodingChallenges();
      if (result.success) {
        setChallenges(result.data);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to load challenges. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchChallenges();
    })();
    return () => { cancelled = true; };
  }, [fetchChallenges]);

  const filteredChallenges = useMemo(() => {
    let result = challenges;
    result = searchChallenges(result, searchQuery);
    result = filterByDifficulty(result, difficultyFilter);
    result = filterByTopic(result, topicFilter);
    result = filterByStatus(result, statusFilter);
    return result;
  }, [challenges, searchQuery, difficultyFilter, topicFilter, statusFilter]);

  return {
    challenges,
    filteredChallenges,
    isLoading,
    error,
    searchQuery,
    difficultyFilter,
    topicFilter,
    statusFilter,
    setSearchQuery,
    setDifficultyFilter,
    setTopicFilter,
    setStatusFilter,
    refetch: fetchChallenges,
  };
}
