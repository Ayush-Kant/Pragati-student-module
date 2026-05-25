function CollegeRankingTable({ rankings = [], darkMode = false }) {

  if (rankings.length === 0) {
    return (
      <div className={`rounded-lg shadow mt-6 p-6 transition ${darkMode ? "bg-slate-950 shadow-black/30 border border-slate-700" : "bg-white"}`}>
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Performance Rankings
        </h2>
        <div className={`text-center py-10 transition ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
          No ranking data available
        </div>
      </div>
    );
  }

  const getColor = (rate) => {
    if (rate >= 50) return "bg-green-500";
    if (rate >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`rounded-lg shadow mt-6 p-6 transition ${darkMode ? "bg-slate-950 shadow-black/30 border border-slate-700" : "bg-white"}`}>
      <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}>
        Performance Rankings
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className={`border-b ${darkMode ? "border-slate-700" : "border-gray-200"}`}>
            <tr className={`text-xs uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
              <th className={`text-left py-4 px-4 ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
                Rank
              </th>
              <th className={`text-left py-4 px-4 ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
                College
              </th>
              <th className={`text-left py-4 px-4 ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
                Selection Rate
              </th>
              <th className={`text-left py-4 px-4 ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
                Participation Rate
              </th>
              <th className={`text-left py-4 px-4 ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
                Total Selected
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rankings.map((college) => (
              <tr
                key={college.collegeId}
                className={`
                  border-b
                  transition-colors duration-500
                  ${darkMode ? "hover:bg-slate-900" : "hover:bg-gray-50"}
                  ${college.rank === 1
                    ? "border-l-4 border-yellow-400"
                    : ""
                  }
                `}
              >

                {/* Rank */}
                <td className="py-5 pl-8 font-semibold text-lg">
                  {college.rank}
                </td>

                {/* College */}
                <td className="py-5 px-4 font-medium">
                  {college.name}
                </td>

                {/* Selection Rate */}
                <td className="py-5 px-4">
                  <div className="flex items-center gap-4 min-w-[220px]">
                    <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${getColor(college.selectionRate)}`}
                        style={{
                          width: `${college.selectionRate}%`
                        }}
                      />
                    </div>
                    <span className="font-medium">
                      {college.selectionRate.toFixed(1)}%
                    </span>
                  </div>
                </td>

                {/* Participation Rate */}
                <td className="py-5 px-4 font-medium">
                  {college.participationRate.toFixed(1)}%
                </td>

                {/* Total Selected */}
                <td className="py-5 px-4 font-medium">
                  {college.totalSelected}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CollegeRankingTable;