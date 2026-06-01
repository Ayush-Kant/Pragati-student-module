export default function CompanyActivityLog({
  activityLogs = [],
}) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">
        Recent Activity
      </h2>

      {activityLogs.length === 0 ? (
        <p>No activity found.</p>
      ) : (
        <div className="space-y-3">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className="border-b pb-3"
            >
              <p className="font-medium">
                ✓ {log.action}
              </p>

              <p className="text-sm text-gray-500">
                By: {log.actor}
              </p>

              <p className="text-sm text-gray-500">
                {log.timestamp}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}