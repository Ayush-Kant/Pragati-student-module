export default function CompanyActivityLog({
  activityLogs = [],
  darkMode = false,
}) {
  return (
    <div className={`rounded-xl p-4 shadow-sm transition ${darkMode ? "bg-slate-950 border border-slate-700" : "bg-white border border-slate-200"}`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
        Recent Activity
      </h2>

      {activityLogs.length === 0 ? (
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-700"}`}>No activity found.</p>
      ) : (
        <div className="space-y-3">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className={`border-l-4 pl-4 ${darkMode ? "border-green-500" : "border-green-500"}`}
            >
              <p className={`font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>
                ✓ {log.action}
              </p>

              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                By: {log.actor}
              </p>

              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                {log.timestamp}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}