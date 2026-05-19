import React from "react";

const avatarColors = ["bg-blue-400", "bg-orange-400", "bg-green-400", "bg-purple-400"];

const getIcon = (type) => {
  switch (type) {
    case "submission": return { icon: "📄", bg: "bg-blue-100" };
    case "session":    return { icon: "🎥", bg: "bg-green-100" };
    case "review":     return { icon: "✅", bg: "bg-orange-100" };
    default:           return { icon: "🔔", bg: "bg-gray-100" };
  }
};

const timeAgo = ["2h ago", "4h ago", "6h ago", "1d ago"];

const NotificationsFeed = ({ notifications }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-sm text-gray-700">Recent Activity</p>
        <span className="text-blue-500 text-xs cursor-pointer font-medium">View All</span>
      </div>

      {!notifications || notifications.length === 0 ? (
        <p className="text-gray-400 text-sm">No new notifications</p>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((item, index) => {
            const { icon, bg } = getIcon(item.type);
            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-sm flex-shrink-0`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-700 font-medium leading-snug">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.subtext || ""}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo[index % timeAgo.length]}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsFeed;