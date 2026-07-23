import { AnalyticsReportTable } from "./AnalyticsReportTable";

export const StudentReport = ({ darkMode, data = null, loading }) => {
  const tableData = data?.statusCounts?.map((s) => ({
    Status: s.status,
    Count: s.count,
  })) || [];

  return (
    <div className="flex flex-col gap-3">
      <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#2D3436]"}`}>Student Report</h3>
      <AnalyticsReportTable darkMode={darkMode} loading={loading} data={tableData} />
      {data?.cgpaRanges && (
        <div className={`rounded-xl border p-4 ${darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"}`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>CGPA Distribution</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "9-10", value: data.cgpaRanges.range_9_10 },
              { label: "8-9", value: data.cgpaRanges.range_8_9 },
              { label: "7-8", value: data.cgpaRanges.range_7_8 },
              { label: "<7", value: data.cgpaRanges.range_below_7 },
            ].map(({ label, value }) => (
              <div key={label} className={`text-center p-3 rounded-lg ${darkMode ? "bg-[#3D3D3D]" : "bg-gray-50"}`}>
                <p className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#2D3436]"}`}>{value}</p>
                <p className={`text-[10px] font-medium ${darkMode ? "text-gray-500" : "text-gray-400"}`}>CGPA {label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
