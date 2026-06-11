export default function CompanyStatusBadge({ status, darkMode = false }) {
  const statusStyles = {
    Approved: darkMode ? "bg-emerald-700 text-white" : "bg-green-100 text-green-700",
    Pending: darkMode ? "bg-amber-700 text-white" : "bg-yellow-100 text-yellow-700",
    Suspended: darkMode ? "bg-red-700 text-white" : "bg-red-100 text-red-700",
    Rejected: darkMode ? "bg-slate-700 text-slate-100" : "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}