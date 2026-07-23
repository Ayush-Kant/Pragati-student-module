import { StatisticsCards } from "./StatisticsCards";
import { SummaryCards } from "./SummaryCards";
import { KPISection } from "./KPISection";

export const AnalyticsOverview = ({ darkMode, dashboardData, placementData }) => (
  <div className="flex flex-col gap-6">
    <StatisticsCards darkMode={darkMode} data={dashboardData} />
    <SummaryCards darkMode={darkMode} data={dashboardData} />
    <KPISection darkMode={darkMode} placementData={placementData} />
  </div>
);
