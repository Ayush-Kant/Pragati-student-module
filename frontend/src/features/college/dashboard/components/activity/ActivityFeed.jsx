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

const ActivityFeed = ({ activities = [] }) => {
  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="bg-white rounded-xl shadow border p-5">
      <h2 className="text-lg font-semibold mb-5">
        Recent Activities
      </h2>

      <div className="space-y-4">
        {displayActivities.map((item, index) => (
          <ActivityCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;