import StatCard from "./StatCard";

const QuickStats = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "24px",
      }}
    >
      <StatCard title="Applications" value="12" />
      <StatCard title="Interviews" value="4" />
      <StatCard title="Tasks" value="8" />
      <StatCard title="Sessions" value="5" />
    </div>
  );
};

export default QuickStats;
