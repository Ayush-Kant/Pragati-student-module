import React from "react";
import StatsCard from "./StatsCard";
import { dashboardStats } from "../../types/dashboardDummyData";

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {dashboardStats.map((stat) => (
        <StatsCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          change={stat.change}
        />
      ))}
    </div>
  );
};

export default StatsGrid;