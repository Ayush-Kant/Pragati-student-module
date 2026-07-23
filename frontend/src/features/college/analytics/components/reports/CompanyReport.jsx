import { AnalyticsReportTable } from "./AnalyticsReportTable";

export const CompanyReport = ({ darkMode, data = [], loading }) => (
  <div className="flex flex-col gap-3">
    <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#2D3436]"}`}>Company Report</h3>
    <AnalyticsReportTable
      darkMode={darkMode}
      loading={loading}
      data={data.map((d) => ({
        Company: d.company || d.company_name,
        "Total Hired": d.offers || d.total_hired,
        "Avg Package (LPA)": d.avgPackage || d.average_package,
      }))}
    />
  </div>
);
