export default function CompanyDrivesList({
  activeDrives = [],
}) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">
        Active Drives
      </h2>

      {activeDrives.length === 0 ? (
        <p>No active drives found.</p>
      ) : (
        <div className="space-y-3">
          {activeDrives.map((drive) => (
            <div
              key={drive.id}
              className="border-b pb-3"
            >
              <p className="font-medium">
                {drive.title}
              </p>

              <p className="text-sm text-gray-500">
                Status: {drive.status}
              </p>

              <p className="text-sm text-gray-500">
                {drive.startDate} to {drive.endDate}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}