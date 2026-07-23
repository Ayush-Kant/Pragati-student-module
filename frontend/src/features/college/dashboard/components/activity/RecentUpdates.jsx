const updates = [
  "Amazon Drive starts on 15 July",
  "Microsoft shortlisted 120 students",
  "Placement Report uploaded",
  "New Company Registration Approved",
];

const RecentUpdates = () => {
  return (
    <div className="bg-white rounded-xl shadow border p-5">
      <h2 className="text-lg font-semibold mb-5">
        Recent Updates
      </h2>

      <ul className="space-y-3">
        {updates.map((item, index) => (
          <li
            key={index}
            className="border-b pb-2 text-gray-600"
          >
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUpdates;