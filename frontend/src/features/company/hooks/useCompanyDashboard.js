import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useCompanyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [funnelData, setFunnelData] = useState([]);
  const [collegeStats, setCollegeStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, funnelDataRes, collegeData, activityData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getFunnel(),
          dashboardService.getCollegeStats(),
          dashboardService.getActivity()
        ]);

        // Map backend keys to what CompanyStatsRow expects
        setStats({
          activeDrives: statsData.activeDrives,
          applications: statsData.totalApplications,
          interviews: statsData.interviewsScheduled,
          offers: statsData.offersReleased,
          successRate: statsData.hiringSuccessRate
        });

        // Convert funnelDataRes object to chart array format
        const formattedFunnel = [
          { stage: 'Applied', count: funnelDataRes.applied },
          { stage: 'Screened', count: funnelDataRes.screened },
          { stage: 'Trained', count: funnelDataRes.trained },
          { stage: 'Shortlisted', count: funnelDataRes.shortlisted },
          { stage: 'Selected', count: funnelDataRes.selected }
        ];
        setFunnelData(formattedFunnel);

        // Map collegeData to college statistics format
        const formattedCollege = collegeData.map(c => ({
          name: c.collegeName,
          count: c.candidateCount
        }));
        setCollegeStats(formattedCollege);

        // Map activityData to activity list format
        const formattedActivities = activityData.map(act => {
          const initials = act.candidateName
            ? act.candidateName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
            : 'C';
          
          let timeDisplay = 'Just now';
          const diffMs = Date.now() - new Date(act.time).getTime();
          const diffMins = Math.floor(diffMs / 60000);
          if (diffMins > 0) {
            if (diffMins < 60) {
              timeDisplay = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
            } else {
              const diffHrs = Math.floor(diffMins / 60);
              if (diffHrs < 24) {
                timeDisplay = `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
              } else {
                timeDisplay = new Date(act.time).toLocaleDateString();
              }
            }
          }

          return {
            initials,
            message: `${act.candidateName} status changed: ${act.activity}`,
            time: timeDisplay
          };
        });
        setActivities(formattedActivities);
        setError(null);
      } catch (err) {
        setError('Failed to load company dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    stats,
    funnelData,
    collegeStats,
    activities,
    loading,
    error
  };
};