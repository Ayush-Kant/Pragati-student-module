import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCodingChallenges } from '../services/codingChallengeService';
import {
  filterByDifficulty,
  filterByStatus,
  filterByTopic,
  searchChallenges,
} from '../utils/codingChallengeHelpers';
import { PAGE_SIZE } from '../constants/codingChallengeConstants';

/**
 * Fetches and manages the list of coding challenges.
 * Provides client-side filtering, search, pagination, and refetch support.
 *
 * Safety: Uses AbortController to cancel in-flight requests on unmount,
 * preventing stale-response race conditions.
 * Lint-safe: useEffect body only kicks off the request and returns cleanup;
 * all setState calls are inside .then()/.catch() callbacks.
 */
export function useCodingChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchIdRef = useRef(0);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchId = ++fetchIdRef.current;

    getCodingChallenges(abortController.signal)
      .then((result) => {
        if (fetchId !== fetchIdRef.current || abortController.signal.aborted) return;
        if (result.success) {
          setChallenges(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || fetchId !== fetchIdRef.current) return;
        setError('Failed to load challenges. Please try again.');
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, []);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    const abortController = new AbortController();
    const fetchId = ++fetchIdRef.current;

    getCodingChallenges(abortController.signal)
      .then((result) => {
        if (fetchId !== fetchIdRef.current || abortController.signal.aborted) return;
        if (result.success) {
          setChallenges(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || fetchId !== fetchIdRef.current) return;
        setError('Failed to load challenges. Please try again.');
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, []);

  // Reset page to 1 whenever filters/search change
  const wrappedSetSearchQuery      = useCallback((q) => { setSearchQuery(q);      setCurrentPage(1); }, []);
  const wrappedSetDifficultyFilter = useCallback((d) => { setDifficultyFilter(d); setCurrentPage(1); }, []);
  const wrappedSetTopicFilter      = useCallback((t) => { setTopicFilter(t);      setCurrentPage(1); }, []);
  const wrappedSetStatusFilter     = useCallback((s) => { setStatusFilter(s);     setCurrentPage(1); }, []);

  const filteredChallenges = useMemo(() => {
    let result = challenges;
    result = searchChallenges(result, searchQuery);
    result = filterByDifficulty(result, difficultyFilter);
    result = filterByTopic(result, topicFilter);
    result = filterByStatus(result, statusFilter);
    return result;
  }, [challenges, searchQuery, difficultyFilter, topicFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredChallenges.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);

  const paginatedChallenges = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredChallenges.slice(start, start + PAGE_SIZE);
  }, [filteredChallenges, safePage]);

  return {
    challenges,
    filteredChallenges,
    paginatedChallenges,
    isLoading,
    error,
    searchQuery,
    difficultyFilter,
    topicFilter,
    statusFilter,
    currentPage: safePage,
    totalPages,
    setSearchQuery: wrappedSetSearchQuery,
    setDifficultyFilter: wrappedSetDifficultyFilter,
    setTopicFilter: wrappedSetTopicFilter,
    setStatusFilter: wrappedSetStatusFilter,
    setCurrentPage,
    refetch,
  };
}
