const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
        status === "Open"
          ? "bg-green-500"
          : "bg-red-500"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;