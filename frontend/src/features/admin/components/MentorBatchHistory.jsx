export default function MentorBatchHistory({
  batches,
  darkMode
}) {
  if (!batches || batches.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-lg shadow p-6 mt-6 ${
        darkMode
          ? "bg-slate-950 border border-slate-700"
          : "bg-white"
      }`}
    >

      <h2 className="text-xl font-bold mb-6">
        Batch History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`border-b ${
                darkMode
                  ? "border-slate-700 text-slate-300"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              <th className="text-left p-3">Drive ID</th>
              <th className="text-left p-3">Batch ID</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr
                key={batch.batchId}
                className={`border-b ${
                  darkMode
                    ? "border-slate-800 hover:bg-slate-900"
                    : "border-slate-100 hover:bg-gray-50"
                }`}
              >
                <td className="p-3">{batch.driveId}</td>

                <td className="p-3">{batch.batchId}</td>

                <td className="p-3 font-medium">{batch.title}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      batch.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {batch.status.charAt(0).toUpperCase() +
                      batch.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}