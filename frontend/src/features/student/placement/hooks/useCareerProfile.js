// src/features/student/placement/hooks/useCareerProfile.js
// TanStack Query hook for student career profile.

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, STALE_TIME } from '../constants/placementConstants';
import { getCareerProfile } from '../services/placementService';

export function useCareerProfile() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: QUERY_KEYS.CAREER_PROFILE,
    queryFn: async () => {
      const res = await getCareerProfile();
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    staleTime: STALE_TIME.MEDIUM,
  });

  return {
    profile: data || null,
    isLoading,
    isFetching,
    isError,
    error: error?.message || null,
    refetch,
  };
}
