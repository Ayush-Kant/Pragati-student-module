export default function MentorPerformanceCard({
  performance,
  darkMode
}) {
  if (!performance) {
    return null;
  }

  return (
    <div
      className={`rounded-lg shadow p-6 ${
        darkMode
          ? "bg-slate-950 border border-slate-700"
          : "bg-white"
      }`}
    >

      <h2 className="text-xl font-bold mb-6">
        Performance Metrics
      </h2>

      <div className="grid md:grid-cols-4 gap-4">

        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-green-50 border-green-200"
          }`}
        >
          <h3 className={`text-sm font-semibold mb-2 ${
            darkMode ? "text-green-400" : "text-green-700"
          }`}>
            Rating
          </h3>

          <p className="text-3xl font-bold">
            ⭐ {performance.rating}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <h3 className={`text-sm font-semibold mb-2 ${
            darkMode ? "text-blue-400" : "text-blue-700"
          }`}>
            Total Reviews
          </h3>

          <p className="text-3xl font-bold">
            {performance.totalReviews}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <h3 className={`text-sm font-semibold mb-2 ${
            darkMode ? "text-yellow-400" : "text-yellow-700"
          }`}>
            Completion Rate
          </h3>

          <p className="text-3xl font-bold">
            {performance.completionRate}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-purple-50 border-purple-200"
          }`}
        >
          <h3 className={`text-sm font-semibold mb-2 ${
            darkMode ? "text-purple-400" : "text-purple-700"
          }`}>
            Avg Score
          </h3>

          <p className="text-3xl font-bold">
            {performance.avgAssignmentScore}
          </p>
        </div>

      </div>

    </div>
  );
}