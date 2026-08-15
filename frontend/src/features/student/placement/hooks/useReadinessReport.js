// src/features/student/placement/hooks/useReadinessReport.js
// TanStack Query hook for readiness score breakdown, improvement areas, and recommendations.

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, STALE_TIME } from '../constants/placementConstants';
import {
  getReadinessReport,
  getCareerRecommendations,
} from '../services/placementService';

export function useReadinessReport() {
  const readinessQuery = useQuery({
    queryKey: QUERY_KEYS.READINESS_REPORT,
    queryFn: async () => {
      const res = await getReadinessReport();
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    staleTime: STALE_TIME.MEDIUM,
  });

  const recommendationsQuery = useQuery({
    queryKey: QUERY_KEYS.RECOMMENDATIONS,
    queryFn: async () => {
      const res = await getCareerRecommendations();
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    staleTime: STALE_TIME.LONG,
  });

  const isLoading = readinessQuery.isLoading || recommendationsQuery.isLoading;
  const isError = readinessQuery.isError || recommendationsQuery.isError;
  const error =
    readinessQuery.error?.message ||
    recommendationsQuery.error?.message ||
    null;

  return {
    report: readinessQuery.data || null,
    categories: readinessQuery.data?.categories || [],
    improvementAreas: readinessQuery.data?.improvementAreas || [],
    recommendations: recommendationsQuery.data || [],
    overallScore: readinessQuery.data?.overallScore ?? null,
    generatedAt: readinessQuery.data?.generatedAt || null,
    isLoading,
    isFetching: readinessQuery.isFetching || recommendationsQuery.isFetching,
    isError,
    error,
    refetch: () => {
      readinessQuery.refetch();
      recommendationsQuery.refetch();
    },
  };
}
