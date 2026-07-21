const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-700",

  medium: "bg-blue-100 text-blue-700",

  high: "bg-orange-100 text-orange-700",

  urgent: "bg-red-100 text-red-700",
};

const DisputePriorityBadge = ({ priority }) => {
  const key = priority?.toLowerCase() || "";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        PRIORITY_COLORS[key] || "bg-gray-100 text-gray-700"
      }`}
    >
      {priority}
    </span>
  );
};

export default DisputePriorityBadge;