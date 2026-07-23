import { cardClass, headingText, subtleText } from "../../utils/analyticsHelpers";

export const AnalyticsReportTable = ({ darkMode, data = [], loading = false }) => {
  if (loading) {
    return (
      <div className={cardClass(darkMode)}>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-9 rounded-lg ${darkMode ? "bg-[#3D3D3D]" : "bg-gray-100"}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`${cardClass(darkMode)} text-center py-8`}>
        <p className={`text-sm ${subtleText(darkMode)}`}>No report data available</p>
      </div>
    );
  }

  const keys = Object.keys(data[0]);

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${
      darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className={darkMode ? "bg-[#3D3D3D]" : "bg-gray-50"}>
              {keys.map((key) => (
                <th key={key} className={`px-4 py-3 text-left font-bold uppercase tracking-wider ${subtleText(darkMode)}`}>
                  {key.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={`border-t transition-colors ${
                darkMode ? "border-[#3D3D3D] hover:bg-[#333]" : "border-gray-50 hover:bg-gray-50"
              }`}>
                {keys.map((key) => (
                  <td key={key} className={`px-4 py-2.5 ${headingText(darkMode)}`}>
                    {row[key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
