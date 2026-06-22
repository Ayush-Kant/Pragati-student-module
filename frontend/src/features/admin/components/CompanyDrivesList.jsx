export default function CompanyDrivesList({ activeDrives = [], darkMode = false }) {

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  return (
    <div className={`rounded-xl p-4 shadow-sm transition ${darkMode ? "bg-slate-950 border border-slate-700" : "bg-white border border-slate-200"}`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
        Active Drives
      </h2>

      {activeDrives.length === 0 ? (
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-700"}`}>No active drives found.</p>
      ) : (
        <div className="space-y-3">
          {activeDrives.map((drive) => (
            <div
              key={drive.id}
              className={`rounded-lg p-4 transition ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border border-slate-200"}`}>
              <p className={`font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>
                {drive.title}
              </p>

              <p className={`text-sm ${darkMode
                ? "text-slate-300"
                : "text-gray-500"
                }`}>
                Status: {drive.status}
              </p>

              <p className="text-sm text-gray-500">
                {formatDate(drive.startDate)}
                -
                {formatDate(drive.endDate)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}