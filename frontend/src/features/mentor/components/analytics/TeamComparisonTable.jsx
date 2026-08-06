export default function TeamComparisonTable({ data }) {

  const teams = data;

  const badgeClasses = {
    Passed: "bg-green-100 text-green-700",
    Reviewed: "bg-blue-100 text-blue-700",
    Failed: "bg-red-100 text-red-700",
  };

  const handleExportCSV = () => {

    const headers = [
      "Team",
      "Overall",
      "Architecture",
      "Code Quality",
      "Status",
    ];

    const rows = teams.map((team) => [
      team.team,
      team.overall,
      team.architecture,
      team.codeQuality,
      team.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "team-comparison.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border rounded-xl p-6 h-full">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-xl font-semibold">
          Team Comparison
        </h2>

        <button
          onClick={handleExportCSV}
          className="text-blue-600 text-sm hover:underline"
        >
          Export CSV
        </button>

      </div>

      <table className="w-full text-sm">

        <thead className="bg-indigo-50 text-gray-600">

          <tr>

            <th className="text-left p-3">
              Team
            </th>

            <th className="text-center">
              Overall
            </th>

            <th className="text-center">
              Arch.
            </th>

            <th className="text-center">
              Code Q.
            </th>

            <th className="text-center">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {teams.map((team) => (

            <tr
              key={team.team}
              className="border-b hover:bg-gray-50 transition"
            >

              <td className="p-3 font-medium">
                {team.team}
              </td>

              <td className="text-center">
                {team.overall}
              </td>

              <td className="text-center">
                {team.architecture}
              </td>

              <td className="text-center">
                {team.codeQuality}
              </td>

              <td className="text-center">

                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${badgeClasses[team.status]}`}
                >
                  {team.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}