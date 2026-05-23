function CollegeRankingTable({ rankings = [] }) {

  const getColor = (rate) => {
    if (rate >= 50) return "bg-green-500";
    if (rate >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className=" rounded-lg shadow mt-6 p-6">
      <h2 className="text-xl font-bold mb-6">
        Performance Rankings
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="border-b">
            <tr className="text-gray-400 text-xs uppercase tracking-wide">
              <th className="text-left py-4 px-4">
                Rank
              </th>
              <th className="text-left py-4 px-4">
                College
              </th>
              <th className="text-left py-4 px-4">
                Selection Rate
              </th>
              <th className="text-left py-4 px-4">
                Participation Rate
              </th>
              <th className="text-left py-4 px-4">
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
                  hover:bg-gray-50
                  transition
                  ${
                    college.rank === 1
                      ? "border-l-[6px] border-yellow-400 "
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
                    <div
                      className="
                      w-32
                      h-3
                      bg-gray-200
                      rounded-full
                      overflow-hidden
                    "
                    >
                      <div
                        className={`
                          h-full
                          ${getColor(
                            college.selectionRate
                          )}
                        `}
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