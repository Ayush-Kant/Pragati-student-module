const STATUS_COLORS = {
  open: "bg-red-100 text-red-700",

  "in review": "bg-yellow-100 text-yellow-700",

  resolved: "bg-green-100 text-green-700",

  escalated: "bg-purple-100 text-purple-700",
};

const DisputeStatusBadge = ({ status }) => {
  const key = status?.toLowerCase() || "";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        STATUS_COLORS[key] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default DisputeStatusBadge;