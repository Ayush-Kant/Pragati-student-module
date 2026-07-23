import "./../styles/companyDashboard.css";
import { useCompanyDashboard } from '../hooks/useCompanyDashboard';

import ActivityFeed from "../components/ActivityFeed";
import QuickActions from "../components/QuickActions";

import CompanyStatsRow from "../components/CompanyStatsRow";
import CandidateFunnelChart from "../components/CandidateFunnelChart";
import CollegeParticipationTable from "../components/CollegeParticipationTable";

const CompanyDashboard = () => {
  const { stats, funnelData, collegeStats, activities, loading, error } = useCompanyDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin inline-block"></div>
          <p className="text-gray-600 mt-4 font-semibold">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <p>
          Welcome back! Here's what's happening
          with your recruitment.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <CompanyStatsRow stats={stats} />

      <div className="dashboard-grid">
        <CandidateFunnelChart data={funnelData} />

        <CollegeParticipationTable
          data={collegeStats}
        />
      </div>
      <div className="dashboard-bottom-grid">
        <ActivityFeed activities={activities} />

        <QuickActions />
      </div>
    </div>
  );
};

export default CompanyDashboard;