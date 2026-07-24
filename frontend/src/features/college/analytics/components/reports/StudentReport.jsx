import { AnalyticsReportTable } from "./AnalyticsReportTable";
import { cardClass, headingText, subtleText } from "../../utils/analyticsHelpers";

export const StudentReport = ({ darkMode, data = null, loading }) => {
  const tableData = data?.statusCounts?.map((s) => ({
    Status: s.status,
    Count: s.count,
  })) || [];

  return (
    <div className="flex flex-col gap-3">
      <h3 className={`text-sm font-bold ${headingText(darkMode)}`}>Student Report</h3>
      <AnalyticsReportTable darkMode={darkMode} loading={loading} data={tableData} />
      {data?.cgpaRanges && (
        <div className={cardClass(darkMode)}>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${subtleText(darkMode)}`}>CGPA Distribution</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "9-10", value: data.cgpaRanges.range_9_10, color: "from-teal-50 to-emerald-50 text-[#00bea3]" },
              { label: "8-9", value: data.cgpaRanges.range_8_9, color: "from-orange-50 to-amber-50 text-[#ff6d34]" },
              { label: "7-8", value: data.cgpaRanges.range_7_8, color: "from-orange-50 to-rose-50 text-[#ff6d34]" },
              { label: "<7", value: data.cgpaRanges.range_below_7, color: "from-teal-50 to-cyan-50 text-[#00bea3]" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`text-center p-3 rounded-xl bg-gradient-to-br ${color} border border-white/50`}>
                <p className="text-lg font-extrabold">{value}</p>
                <p className="text-[10px] font-medium opacity-70">CGPA {label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
