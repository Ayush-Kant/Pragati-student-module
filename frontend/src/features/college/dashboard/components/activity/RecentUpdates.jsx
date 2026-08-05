const updates = [
  "Amazon Drive starts on 15 July",
  "Microsoft shortlisted 120 students",
  "Placement Report uploaded",
  "New Company Registration Approved",
];

const RecentUpdates = ({ darkMode }) => {
  return (
    <div className={`rounded-xl border p-5 ${
      darkMode
        ? "bg-[#2D2D2D] border-[#3D3D3D]"
        : "bg-white border-gray-200 shadow"
    }`}>
      <h2 className={`text-lg font-semibold mb-5 ${
        darkMode ? "text-white" : "text-[#2D3436]"
      }`}>
        Recent Updates
      </h2>

      <ul className="space-y-3">
        {updates.map((item, index) => (
          <li
            key={index}
            className={`border-b pb-2 ${
              darkMode ? "border-[#3D3D3D] text-gray-400" : "border-gray-100 text-gray-600"
            }`}
          >
            <span className="text-[#ff6d34] mr-2">&#9656;</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUpdates;