import { activitiesData } from "../../types/profileExtraDummyData";

const ProfileActivity = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Activity
        </h3>

        <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
          View All
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-5">
        {activitiesData.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div key={activity.id} className="flex items-start gap-4">
              {/* Timeline */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`h-3 w-3 rounded-full ${activity.color}`}
                />

                {index !== activitiesData.length - 1 && (
                  <div className="mt-1 h-12 w-px bg-gray-200" />
                )}
              </div>

              {/* Icon */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${activity.iconBg}`}
              >
                <Icon
                  size={18}
                  className={activity.iconColor}
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 items-center justify-between gap-4">
                <p className="text-sm text-gray-700">
                  {activity.title}
                </p>

                <span className="whitespace-nowrap text-xs text-gray-500">
                  {activity.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileActivity;