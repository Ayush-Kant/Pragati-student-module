import { formatDate } from "../utils/performanceHelpers";

const RecentActivity = ({ activities }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-5 text-xl font-bold text-gray-800">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50"
          >
            <div>
              <h3 className="font-medium text-gray-800">
                {activity.activity}
              </h3>

              <p className="text-sm text-gray-500">
                {formatDate(activity.date)}
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
              Completed
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;