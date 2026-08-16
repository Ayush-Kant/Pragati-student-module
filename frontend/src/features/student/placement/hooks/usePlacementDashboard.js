// src/features/student/placement/hooks/usePlacementDashboard.js
// TanStack Query v5 orchestrator for the placement dashboard.
// Fetches sections in parallel with independent error boundaries so partial failures
// never break the rest of the dashboard.

import { useQueries } from '@tanstack/react-query';
import { QUERY_KEYS, STALE_TIME } from '../constants/placementConstants';
import {
  getPlacementDashboard,
  getSkillReadiness,
  getAssessmentPerformance,
  getApplications,
  getCareerRecommendations,
  getCareerProfile,
} from '../services/placementService';

export function usePlacementDashboard() {
  const results = useQueries({
    queries: [
      {
        queryKey: QUERY_KEYS.PLACEMENT_DASHBOARD,
        queryFn: async () => {
          const res = await getPlacementDashboard();
          if (res.error) throw new Error(res.error.message);
          return res.data;
        },
        staleTime: STALE_TIME.MEDIUM,
      },
      {
        queryKey: QUERY_KEYS.SKILL_READINESS,
        queryFn: async () => {
          const res = await getSkillReadiness();
          if (res.error) throw new Error(res.error.message);
          return res.data;
        },
        staleTime: STALE_TIME.MEDIUM,
      },
      {
        queryKey: QUERY_KEYS.ASSESSMENTS,
        queryFn: async () => {
          const res = await getAssessmentPerformance();
          if (res.error) throw new Error(res.error.message);
          return res.data;
        },
        staleTime: STALE_TIME.MEDIUM,
      },
      {
        queryKey: QUERY_KEYS.APPLICATIONS,
        queryFn: async () => {
          const res = await getApplications({ pageSize: 5 });
          if (res.error) throw new Error(res.error.message);
          return res.data;
        },
        staleTime: STALE_TIME.SHORT,
      },
      {
        queryKey: QUERY_KEYS.RECOMMENDATIONS,
        queryFn: async () => {
          const res = await getCareerRecommendations();
          if (res.error) throw new Error(res.error.message);
          return res.data;
        },
        staleTime: STALE_TIME.LONG,
      },
      {
        queryKey: QUERY_KEYS.CAREER_PROFILE,
        queryFn: async () => {
          const res = await getCareerProfile();
          if (res.error) throw new Error(res.error.message);
          return res.data;
        },
        staleTime: STALE_TIME.MEDIUM,
      },
    ],
  });

  const [
    dashboardQuery,
    skillsQuery,
    assessmentsQuery,
    applicationsQuery,
    recommendationsQuery,
    profileQuery,
  ] = results;

  // Global loading only when all are loading initially
  const isInitialLoading = results.every((q) => q.isLoading);

  // Expose section-by-section states for partial-failure resiliency
  return {
    isInitialLoading,
    refetchAll: () => results.forEach((q) => q.refetch()),

    // Overview / readiness score section
    overview: {
      data: dashboardQuery.data?.overview || null,
      isLoading: dashboardQuery.isLoading,
      isError: dashboardQuery.isError,
      error: dashboardQuery.error,
      refetch: dashboardQuery.refetch,
    },

    // Skills section
    skills: {
      data: skillsQuery.data || dashboardQuery.data?.skills || null,
      isLoading: skillsQuery.isLoading,
      isError: skillsQuery.isError,
      error: skillsQuery.error,
      refetch: skillsQuery.refetch,
    },

    // Assessments section
    assessments: {
      data: assessmentsQuery.data || dashboardQuery.data?.assessments || null,
      isLoading: assessmentsQuery.isLoading,
      isError: assessmentsQuery.isError,
      error: assessmentsQuery.error,
      refetch: assessmentsQuery.refetch,
    },

    // Applications summary section
    applications: {
      data: applicationsQuery.data || dashboardQuery.data?.applications || null,
      isLoading: applicationsQuery.isLoading,
      isError: applicationsQuery.isError,
      error: applicationsQuery.error,
      refetch: applicationsQuery.refetch,
    },

    // Recommendations section
    recommendations: {
      data: recommendationsQuery.data || dashboardQuery.data?.recommendations || null,
      isLoading: recommendationsQuery.isLoading,
      isError: recommendationsQuery.isError,
      error: recommendationsQuery.error,
      refetch: recommendationsQuery.refetch,
    },

    // Profile summary section
    profile: {
      data: profileQuery.data || null,
      isLoading: profileQuery.isLoading,
      isError: profileQuery.isError,
      error: profileQuery.error,
      refetch: profileQuery.refetch,
    },
  };
}
