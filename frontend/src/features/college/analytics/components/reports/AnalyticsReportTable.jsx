export const AnalyticsReportTable = ({ darkMode, data = [], loading = false }) => {
  if (loading) {
    return (
      <div className={`rounded-xl border p-6 ${darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"}`}>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-8 rounded ${darkMode ? "bg-[#3D3D3D]" : "bg-gray-100"}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`rounded-xl border p-8 text-center ${darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"}`}>
        <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No report data available</p>
      </div>
    );
  }

  const keys = Object.keys(data[0]);

  return (
    <div className={`rounded-xl border overflow-hidden ${darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className={darkMode ? "bg-[#3D3D3D]" : "bg-gray-50"}>
              {keys.map((key) => (
                <th key={key} className={`px-4 py-3 text-left font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {key.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={`border-t ${darkMode ? "border-[#3D3D3D] hover:bg-[#333]" : "border-gray-50 hover:bg-gray-50"} transition-colors`}>
                {keys.map((key) => (
                  <td key={key} className={`px-4 py-2.5 ${darkMode ? "text-gray-300" : "text-[#2D3436]"}`}>
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
