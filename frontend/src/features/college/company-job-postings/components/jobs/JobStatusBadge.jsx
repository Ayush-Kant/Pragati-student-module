const JobStatusBadge = ({ status }) => {
  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-semibold text-white
      ${
        status === "Open"
          ? "bg-green-500"
          : "bg-red-500"
      }`}
    >
      {status}
    </span>
  );
};

export default JobStatusBadge;