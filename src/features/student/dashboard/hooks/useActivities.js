import { useState, useEffect, useCallback } from 'react';
import { getUpcomingActivities, getRecentActivities } from '../services/dashboardService';
import { validateActivity } from '../validations/dashboardValidation';

export const useActivities = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivitiesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [upcomingResponse, recentResponse] = await Promise.all([
        getUpcomingActivities(),
        getRecentActivities()
      ]);

      if (upcomingResponse.success && recentResponse.success) {
        // Validate each item in the lists
        upcomingResponse.data.forEach(act => validateActivity(act));
        recentResponse.data.forEach(act => validateActivity(act));

        setData({
          upcoming: upcomingResponse.data,
          recent: recentResponse.data
        });
      } else {
        throw new Error('Failed to retrieve upcoming or recent activities list.');
      }
    } catch (err) {
      console.error('[useActivities error]', err);
      setError(err.message || 'An unexpected error occurred while fetching activities.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivitiesData();
  }, [fetchActivitiesData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchActivitiesData
  };
};
