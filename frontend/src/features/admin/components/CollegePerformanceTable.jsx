const CollegePerformanceTable = ({ colleges }) => {

    // Safety Check
    const safeColleges = Array.isArray(colleges)
        ? [...colleges]
        : [];

    // Sort by selection rate DESC
    const sortedColleges = safeColleges.sort(
        (a, b) => (b.selectionRate || 0) - (a.selectionRate || 0)
    );

    // Empty State
    if (sortedColleges.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
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
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                {/* Table Head */}
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            Rank
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            College Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            Total Students
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            Selected
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 min-w-[180px]">
                            Selection Rate
                        </th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {sortedColleges.map((college, index) => {
                        const selectionRate = Math.max(
                            0,
                            Number(college.selectionRate || 0)
                        );
                        const progressColor = getProgressColor(selectionRate);
                        const isTopRank = index === 0;

                        return (
                            <tr
                                key={college.collegeId || index}
                                className={`
                  border-b border-gray-100
                  hover:bg-gray-50
                  transition-colors
                  duration-200
                  ${isTopRank ? "border-l-4 border-l-yellow-400 bg-yellow-50/40" : ""}
                `}
                            >

                                {/* Rank */}
                                <td className="py-4 px-4 font-semibold text-gray-800">
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
                                <td className="py-4 px-4 text-gray-700 font-medium">
                                    {college.name || "N/A"}
                                </td>

                                {/* Total Students */}
                                <td className="py-4 px-4 text-gray-700">
                                    {Math.max(0, college.totalStudents || 0)}
                                </td>

                                {/* Selected */}
                                <td className="py-4 px-4 text-gray-700">
                                    {Math.max(0, college.selected || 0)}
                                </td>

                                {/* Selection Rate */}
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        {/* Progress Bar Background */}
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
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
                                                    width: `${Math.min(selectionRate, 100)}%`,
                                                }}
                                            ></div>
                                        </div>

                                        {/* Percentage Text */}
                                        <span className="text-sm font-medium text-gray-700 min-w-[52px]">
                                            {selectionRate.toFixed(1)}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CollegePerformanceTable;