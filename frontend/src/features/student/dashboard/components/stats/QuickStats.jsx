import StatCard from "./StatCard";
import { quickStatsData } from "../../types/dashboardDummyData";

const QuickStats = ({ loading = false, error = false }) => {
  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">Loading stats...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load stats.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickStatsData.map((item, index) => (
        <StatCard key={index} title={item.title} value={item.value} />
      ))}
    </div>
  );
};

export default QuickStats;
