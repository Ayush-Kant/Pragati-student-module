// src/features/student/placement/hooks/useAssessments.js
// TanStack Query hook for student assessment scores, breakdowns, and weekly trends.

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, STALE_TIME } from '../constants/placementConstants';
import { getAssessmentPerformance } from '../services/placementService';

export function useAssessments() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: QUERY_KEYS.ASSESSMENTS,
    queryFn: async () => {
      const res = await getAssessmentPerformance();
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    staleTime: STALE_TIME.MEDIUM,
  });

  return {
    assessmentData: data || null,
    categories: data?.categories || [],
    weeklyTrend: data?.weeklyTrend || [],
    overallAssessmentScore: data?.overallAssessmentScore ?? null,
    isLoading,
    isFetching,
    isError,
    error: error?.message || null,
    refetch,
  };
}
