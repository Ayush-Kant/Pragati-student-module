import { AnalyticsReportTable } from "./AnalyticsReportTable";
import { headingText, subtleText } from "../../utils/analyticsHelpers";

export const DepartmentReport = ({ darkMode, data = [], loading }) => (
  <div className="flex flex-col gap-3">
    <h3 className={`text-sm font-bold ${headingText(darkMode)}`}>Department Report</h3>
    <AnalyticsReportTable
      darkMode={darkMode}
      loading={loading}
      data={data.map((d) => ({
        Department: d.dept || d.department_name,
        Students: d.students || d.total_students,
        Placed: d.placed || d.total_placed,
        "Rate %": d.rate || d.placement_rate,
        "Avg Package (LPA)": d.avgPackage || d.average_package,
      }))}
    />
  </div>
);
