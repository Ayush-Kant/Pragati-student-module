import {
  CalendarDays,
  ClipboardList,
  BarChart3,
  Building2,
  Bell,
} from "lucide-react";
const notificationIcons = {
  session: <CalendarDays className="w-6 h-6 text-blue-500" />,

  assignment: <ClipboardList className="w-6 h-6 text-yellow-500" />,

  quiz: <BarChart3 className="w-6 h-6 text-purple-500" />,

  drive: <Building2 className="w-6 h-6 text-green-500" />,

  general: <Bell className="w-6 h-6 text-gray-500" />,
};

const NotificationItem = ({ notification }) => {
  return (
    <div
      className={`relative flex items-start justify-between rounded-[18px] border px-5 py-4 shadow-sm transition-all
      ${
        notification.isRead
          ? "bg-white border-gray-200"
          : "bg-[#f3f8ff] border-[#cfe0ff] border-l-4 border-l-blue-500"
      }`}
    >
      {/* Left */}
      <div className="flex gap-5">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[22px]
          ${
            notification.isRead
              ? "bg-[#f3f4f6]"
              : "bg-white border border-[#dbeafe]"
          }`}
        >
          {notificationIcons[notification.type]}
        </div>

        {/* Text */}
        <div>
          <h3 className="text-[15px] font-semibold text-[#111827]">
            {notification.title}
          </h3>

          <p className="text-[14px] text-gray-500 mt-1 truncate max-w-[180px] sm:max-w-[300px] lg:max-w-[420px]">
            {notification.message}
          </p>

          <button className="text-[#2563eb] text-[13px] font-semibold mt-2 hover:underline">
            View Details
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 mt-1">
        {!notification.isRead && (
          <div className="w-3 h-3 rounded-full bg-[#2563eb]" />
        )}

        <span className="text-[15px] text-gray-400 whitespace-nowrap">
          {notification.time}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;
