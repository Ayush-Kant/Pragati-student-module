export default function DriveStatusBadge({ status }) {
  const statusStyles = {
    active: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    frozen: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}