import ActivityCard from "./ActivityCard";

const defaultActivities = [
  {
    title: "TCS Placement Drive Published",
    time: "10 min ago",
    status: "Completed",
  },
  {
    title: "150 Students Registered",
    time: "35 min ago",
    status: "Completed",
  },
  {
    title: "Infosys Eligibility Updated",
    time: "1 hour ago",
    status: "Pending",
  },
  {
    title: "College Profile Updated",
    time: "2 hours ago",
    status: "Info",
  },
];

const ActivityFeed = ({ darkMode, activities = [] }) => {
  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className={`rounded-xl border p-5 ${
      darkMode
        ? "bg-[#2D2D2D] border-[#3D3D3D]"
        : "bg-white border-gray-200 shadow"
    }`}>
      <h2 className={`text-lg font-semibold mb-5 ${
        darkMode ? "text-white" : "text-[#2D3436]"
      }`}>
        Recent Activities
      </h2>

      <div className="space-y-4">
        {displayActivities.map((item, index) => (
          <ActivityCard key={index} darkMode={darkMode} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;