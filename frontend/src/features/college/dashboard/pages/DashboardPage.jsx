import AdmissionsChart from "../components/charts/AdmissionsChart";
import PlacementChart from "../components/charts/PlacementChart";
import RevenueChart from "../components/charts/RevenueChart";
import StatsGrid from "../components/stats/StatsGrid";
import StatsSkeleton from "../components/stats/StatsSkeleton";
import useDashboardData from "../hooks/useDashboardData";
import ActivityFeed from "../components/activity/ActivityFeed";
import RecentUpdates from "../components/activity/RecentUpdates";

const DashboardPage = () => {
  const { dashboardStats, isLoading } = useDashboardData();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          College Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Monitor student analytics, placement drives and performance.
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <StatsGrid stats={dashboardStats} />
      )}

      {/* Charts */}
      <div>
        <h2 className="mb-5 text-lg font-semibold">
          Analytics & Trends
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdmissionsChart />
          <PlacementChart />
        </div>

        <div className="mt-6">
          <RevenueChart />
        </div>

{/* Recent Activity Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
  <ActivityFeed />
  <RecentUpdates />
</div>
      </div>
    </div>
  );
};

export default DashboardPage;