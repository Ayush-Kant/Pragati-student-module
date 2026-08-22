import { useOutletContext } from "react-router-dom";
import AdmissionsChart from "../components/charts/AdmissionsChart";
import PlacementChart from "../components/charts/PlacementChart";
import RevenueChart from "../components/charts/RevenueChart";
import StatsGrid from "../components/stats/StatsGrid";
import StatsSkeleton from "../components/stats/StatsSkeleton";
import useDashboardData from "../hooks/useDashboardData";
import ActivityFeed from "../components/activity/ActivityFeed";
import RecentUpdates from "../components/activity/RecentUpdates";

const DashboardPage = () => {
  const { darkMode } = useOutletContext();
  const { 
    dashboardStats, 
    dashboardActivities,
    placementAnalytics,
    revenueAnalytics,
    admissionsAnalytics,
    isLoading 
  } = useDashboardData();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#2D3436]"}`}>
          College Dashboard
        </h1>

        <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Monitor student analytics, placement drives and performance.
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton darkMode={darkMode} />
      ) : (
        <StatsGrid darkMode={darkMode} stats={dashboardStats} />
      )}

      {/* Charts */}
      <div>
        <h2 className={`mb-5 text-lg font-semibold ${darkMode ? "text-white" : "text-[#2D3436]"}`}>
          Analytics & Trends
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdmissionsChart darkMode={darkMode} data={admissionsAnalytics} />
          <PlacementChart darkMode={darkMode} data={placementAnalytics} />
        </div>

        <div className="mt-6">
          <RevenueChart darkMode={darkMode} data={revenueAnalytics} />
        </div>

{/* Recent Activity Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
  <ActivityFeed darkMode={darkMode} activities={dashboardActivities} />
  <RecentUpdates darkMode={darkMode} />
</div>
      </div>
    </div>
  );
};

export default DashboardPage;