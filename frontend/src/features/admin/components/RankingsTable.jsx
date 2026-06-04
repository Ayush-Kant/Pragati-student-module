function RankingsTable({
    rankings = [],
    darkMode = false,
}) {
    if (rankings.length === 0) {
        return (
            <div
                className={`rounded-lg shadow mt-6 p-12 transition text-center ${darkMode
                        ? "bg-slate-950 shadow-black/30 border border-slate-700"
                        : "bg-white shadow-sm"
                    }`}
            >
                <div className="text-4xl mb-3">📊</div>
                <h2
                    className={`text-xl font-bold mb-2 ${darkMode
                            ? "text-white"
                            : "text-slate-900"
                        }`}
                >
                    No Rankings Available
                </h2>
                <p
                    className={`${darkMode
                            ? "text-slate-400"
                            : "text-gray-500"
                        }`}
                >
                    Once companies start their hiring process, their rankings will appear here.
                </p>
            </div>
        );
    }

    const getRankStyle = (rank) => {
        if (rank === 1)
            return "border-l-4 border-yellow-400";
        if (rank === 2)
            return "border-l-4 border-gray-400";
        if (rank === 3)
            return "border-l-4 border-amber-700";

        return "";
    };

    return (
        <div
            className={`rounded-lg shadow mt-6 p-6 transition ${darkMode
                    ? "bg-slate-950 shadow-black/30 border border-slate-700"
                    : "bg-white"
                }`}
        >
            <h2
                className={`text-xl font-bold mb-6 ${darkMode
                        ? "text-white"
                        : "text-slate-900"
                    }`}
            >
                Company Performance Rankings
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Header */}
                    <thead
                        className={`border-b ${darkMode
                                ? "border-slate-700"
                                : "border-gray-200"
                            }`}
                    >
                        <tr
                            className={`text-xs uppercase tracking-wide ${darkMode
                                    ? "text-slate-400"
                                    : "text-gray-400"
                                }`}
                        >
                            <th className="text-left py-4 px-4">
                                Rank
                            </th>

                            <th className="text-left py-4 px-4">
                                Company
                            </th>

                            <th className="text-left py-4 px-4">
                                Engagement Score
                            </th>

                            <th className="text-left py-4 px-4">
                                Acceptance Rate
                            </th>

                            <th className="text-left py-4 px-4">
                                Interview-to-Hire
                            </th>

                            <th className="text-left py-4 px-4">
                                Hires Made
                            </th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {rankings.map((company) => (
                            <tr
                                key={company.rank}
                                className={`
                  border-b
                  transition-colors duration-300
                  ${darkMode
                                        ? "hover:bg-slate-900"
                                        : "hover:bg-gray-50"
                                    }
                  ${getRankStyle(company.rank)}
                `}
                            >
                                {/* Rank */}
                                <td className="py-5 px-4 font-bold text-lg">
                                    #{company.rank}
                                </td>

                                {/* Company */}
                                <td className="py-5 px-4 font-medium">
                                    {company.company}
                                </td>

                                {/* Engagement Score */}
                                <td className="py-5 px-4">
                                    {company.engagementScore}
                                </td>

                                {/* Acceptance Rate */}
                                <td className="py-5 px-4">
                                    {company.acceptanceRate}%
                                </td>

                                {/* Interview to Hire */}
                                <td className="py-5 px-4">
                                    {company.interviewToHire}%
                                </td>

                                {/* Hires Made */}
                                <td className="py-5 px-4">
                                    {company.hiresMade}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RankingsTable;