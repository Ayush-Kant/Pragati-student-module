import ProgressCard from "./ProgressCard";
import StatisticsCard from "./StatisticsCard";
import ActivityChart from "./ActivityChart";
import PerformanceChart from "./PerformanceChart";
import SkillProgress from "./SkillProgress";
import RecentActivity from "./RecentActivity";

const PerformanceOverview = ({ data }) => {
  return (
    <div className="space-y-8">

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {data.statistics.map((item) => (
          <StatisticsCard
            key={item.id}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>

      {/* Progress */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.progress.map((item) => (
          <ProgressCard
            key={item.id}
            title={item.title}
            completed={item.completed}
            total={item.total}
            progress={item.progress}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ActivityChart data={data.activityChart} />

        <PerformanceChart data={data.performanceChart} />
      </div>

      {/* Skills & Activities */}
      <div className="grid gap-6 xl:grid-cols-2">
        <SkillProgress skills={data.skills} />

        <RecentActivity
          activities={data.recentActivities}
        />
      </div>

    </div>
  );
};

export default PerformanceOverview;