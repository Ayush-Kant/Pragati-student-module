const JobStatusBadge = ({ status, darkMode }) => {
  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-semibold
      ${
        status === "Open"
          ? darkMode ? "bg-[#00bea3]/20 text-[#00bea3]" : "bg-green-500 text-white"
          : darkMode ? "bg-red-500/20 text-red-400" : "bg-red-500 text-white"
      }`}
    >
      {status}
    </span>
  );
};

export default JobStatusBadge;