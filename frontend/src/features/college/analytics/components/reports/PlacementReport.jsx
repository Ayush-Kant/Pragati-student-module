import { AnalyticsReportTable } from "./AnalyticsReportTable";

export const PlacementReport = ({ darkMode, data = [], loading }) => (
  <div className="flex flex-col gap-3">
    <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#2D3436]"}`}>Placement Report</h3>
    <AnalyticsReportTable
      darkMode={darkMode}
      loading={loading}
      data={data.map((d) => ({
        Year: d.year,
        "Total Students": d.totalStudents || d.total_students,
        Placed: d.placed || d.total_placed,
        "Rate %": d.rate || d.placement_rate,
        "Avg Pkg (LPA)": d.avgPkg || d.average_package,
        "Max Pkg (LPA)": d.maxPkg || d.highest_package,
      }))}
    />
  </div>
);
