const CompanyStatsTable = ({
  companies,
  darkMode,
}) => {
  // Safety check
  const safeCompanies = Array.isArray(companies)
    ? [...companies]
    : [];

  // Sort by total hired DESC
  const sortedCompanies = safeCompanies.sort(
    (a, b) =>
      (b.totalHired || 0) -
      (a.totalHired || 0)
  );

  // Empty State
  if (sortedCompanies.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-40 text-sm ${
          darkMode
            ? "text-gray-400"
            : "text-gray-500"
        }`}
      >
        No company data available
      </div>
    );
  }

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
              Company Name
            </th>

            <th
              className={`text-left py-3 px-4 text-sm font-semibold ${
                darkMode
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              Total Hired
            </th>

            <th
              className={`text-left py-3 px-4 text-sm font-semibold ${
                darkMode
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              Active Drives
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {sortedCompanies.map(
            (company, index) => {
              const isTopRank =
                index === 0;

              return (
                <tr
                  key={
                    company.companyId ||
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

                  {/* Company Name */}
                  <td
                    className={`py-4 px-4 font-medium ${
                      darkMode
                        ? "text-gray-200"
                        : "text-gray-700"
                    }`}
                  >
                    {company.name ||
                      "N/A"}
                  </td>

                  {/* Total Hired */}
                  <td
                    className={`py-4 px-4 ${
                      darkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    {Math.max(
                      0,
                      company.totalHired ||
                        0
                    )}
                  </td>

                  {/* Active Drives */}
                  <td
                    className={`py-4 px-4 ${
                      darkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    {Math.max(
                      0,
                      company.activeDrives ||
                        0
                    )}
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

export default CompanyStatsTable;