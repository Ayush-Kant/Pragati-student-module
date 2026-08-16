// src/features/student/placement/hooks/useSkillReadiness.js
// TanStack Query hook for skill readiness, gaps, and recommendations.

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, STALE_TIME } from '../constants/placementConstants';
import { getSkillReadiness } from '../services/placementService';

export function useSkillReadiness() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: QUERY_KEYS.SKILL_READINESS,
    queryFn: async () => {
      const res = await getSkillReadiness();
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    staleTime: STALE_TIME.MEDIUM,
  });

  return {
    skillData: data || null,
    skills: data?.skills || [],
    skillGapAnalysis: data?.skillGapAnalysis || [],
    recommendedSkills: data?.recommendedSkills || [],
    overallSkillScore: data?.overallSkillScore ?? null,
    isLoading,
    isFetching,
    isError,
    error: error?.message || null,
    refetch,
  };
}
