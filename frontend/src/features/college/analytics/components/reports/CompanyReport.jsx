import { AnalyticsReportTable } from "./AnalyticsReportTable";
import { headingText } from "../../utils/analyticsHelpers";

export const CompanyReport = ({ darkMode, data = [], loading }) => (
  <div className="flex flex-col gap-3">
    <h3 className={`text-sm font-bold ${headingText(darkMode)}`}>Company Report</h3>
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
