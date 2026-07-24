const ActivityCard = ({ darkMode, title, time, status }) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${
      darkMode
        ? "bg-[#1A1A1A] border-[#3D3D3D]"
        : "bg-white border-gray-100 shadow-sm"
    }`}>
      <div>
        <h3 className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{title}</h3>
        <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>{time}</p>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-xs font-medium
        ${
          status === "Completed"
            ? "bg-green-100 text-green-700"
            : status === "Pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-[#ff6d34]/10 text-[#ff6d34]"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

export default ActivityCard;