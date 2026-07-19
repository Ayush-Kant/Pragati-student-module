const CollegePerformanceTable = ({
  colleges,
  darkMode,
}) => {
  // Safety Check
  const safeColleges = Array.isArray(colleges)
    ? [...colleges]
    : [];

  // Sort by selection rate DESC
  const sortedColleges = safeColleges.sort(
    (a, b) =>
      (b.selectionRate || 0) -
      (a.selectionRate || 0)
  );

  // Empty State
  if (sortedColleges.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-40 text-sm ${
          darkMode
            ? "text-gray-400"
            : "text-gray-500"
        }`}
      >
        No college data available
      </div>
    );
  }

  // Progress Bar Color Logic
  const getProgressColor = (rate) => {
    if (rate >= 50) {
      return "bg-green-500";
    }

    if (rate >= 30) {
      return "bg-amber-500";
    }

    return "bg-red-500";
  };

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="min-w-full border-collapse">
        {/* Table Head */}
        <thead>
          <tr
            className={`border-b ${
              darkMode
                ? "border-gray-700"
                : "border-gray-200"
            }`}
          >
            <th
              className={`text-left py-3 px-4 text-sm font-semibold ${
                darkMode
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              Rank
            </th>

            <th
              className={`text-left py-3 px-4 text-sm font-semibold ${
                darkMode
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              College Name
            </th>

            <th
              className={`text-left py-3 px-4 text-sm font-semibold ${
                darkMode
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              Total Students
            </th>

            <th
              className={`text-left py-3 px-4 text-sm font-semibold ${
                darkMode
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              Selected
            </th>

            <th
              className={`text-left py-3 px-4 text-sm font-semibold min-w-[180px] ${
                darkMode
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              Selection Rate
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {sortedColleges.map(
            (college, index) => {
              const selectionRate = Math.max(
                0,
                Number(
                  college.selectionRate ||
                    0
                )
              );

              const progressColor =
                getProgressColor(
                  selectionRate
                );

              const isTopRank =
                index === 0;

              return (
                <tr
                  key={
                    college.collegeId ||
                    index
                  }
                  className={`
                    border-b
                    transition-colors
                    duration-200
                    ${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-700/40"
                        : "border-gray-100 hover:bg-gray-50"
                    }
                    ${
                      isTopRank
                        ? darkMode
                          ? "border-l-4 border-l-yellow-500 bg-yellow-900/20"
                          : "border-l-4 border-l-yellow-400 bg-yellow-50/40"
                        : ""
                    }
                  `}
                >
                  {/* Rank */}
                  <td
                    className={`py-4 px-4 font-semibold ${
                      darkMode
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isTopRank && (
                        <span className="text-yellow-500 text-lg">
                          🏆
                        </span>
                      )}

                      #{index + 1}
                    </div>
                  </td>

                  {/* College Name */}
                  <td
                    className={`py-4 px-4 font-medium ${
                      darkMode
                        ? "text-gray-200"
                        : "text-gray-700"
                    }`}
                  >
                    {college.name ||
                      "N/A"}
                  </td>

                  {/* Total Students */}
                  <td
                    className={`py-4 px-4 ${
                      darkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    {Math.max(
                      0,
                      college.totalStudents ||
                        0
                    )}
                  </td>

                  {/* Selected */}
                  <td
                    className={`py-4 px-4 ${
                      darkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    {Math.max(
                      0,
                      college.selected ||
                        0
                    )}
                  </td>

                  {/* Selection Rate */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* Progress Bar Background */}
                      <div
                        className={`w-full h-2 rounded-full overflow-hidden ${
                          darkMode
                            ? "bg-gray-700"
                            : "bg-gray-200"
                        }`}
                      >
                        {/* Progress Fill */}
                        <div
                          className={`
                            h-full
                            rounded-full
                            transition-all
                            duration-500
                            ${progressColor}
                          `}
                          style={{
                            width: `${Math.min(
                              selectionRate,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      {/* Percentage */}
                      <span
                        className={`text-sm font-medium min-w-[52px] ${
                          darkMode
                            ? "text-gray-200"
                            : "text-gray-700"
                        }`}
                      >
                        {selectionRate.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CollegePerformanceTable;