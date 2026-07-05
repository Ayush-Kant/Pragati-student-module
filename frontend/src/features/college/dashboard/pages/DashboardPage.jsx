import React from "react";
import AdmissionsChart from "../components/charts/AdmissionsChart";
import PlacementChart from "../components/charts/PlacementChart";
import RevenueChart from "../components/charts/RevenueChart";
import StatsGrid from "../components/stats/StatsGrid";
import StatsSkeleton from "../components/stats/StatsSkeleton";
import { useDashboardData } from "../hooks/useDashboardData";

const DashboardPage = () => {
  const { dashboardStats, isLoading } = useDashboardData();

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header Block */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">College Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor student analytics, active placement drives, and performance metrics.</p>
      </div>

      {/* KPI Cards Section */}
      <div>
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <StatsGrid stats={dashboardStats} />
        )}
      </div>

      {/* Analytics & Trends Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Analytics & Trends</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AdmissionsChart />
          <PlacementChart />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <RevenueChart />
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;