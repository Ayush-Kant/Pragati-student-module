import NotificationItem from "./NotificationItem";

const mockNotifications = {
  notifications: [
    {
      notificationId: "n-001",
      title: "New Session Scheduled",
      message: "React Deep Dive session is scheduled for 10 Feb at 10:00 AM",
      type: "session",
      isRead: false,
      time: "2 min ago",
    },
    {
      notificationId: "n-002",
      title: "Assignment Due Tomorrow",
      message: "Build Todo App assignment is due on 8 Feb 11:59 PM",
      type: "assignment",
      isRead: false,
      time: "10 min ago",
    },
    {
      notificationId: "n-003",
      title: "Drive Enrollment Open",
      message:
        "SDE Internship Drive enrollment is now open. Apply before 15 Feb.",
      type: "drive",
      isRead: true,
      time: "1 hour ago",
    },
  ],

  pagination: {
    currentPage: 1,
    totalPages: 3,
    totalCount: 25,
    unreadCount: 2,
  },
};
const NotificationDropdown = () => {
  return (
    <div className="w-[90vw] sm:w-[390px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Notifications
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            You have 2 unread notifications
          </p>
        </div>

        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
          Mark all as read
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto p-3 space-y-3 bg-gray-50">
        {mockNotifications.notifications.length > 0 ? (
          mockNotifications.notifications.map((notification) => (
            <NotificationItem
              key={notification.notificationId}
              notification={notification}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-5xl mb-3">🔔</div>

            <p className="text-gray-500 font-medium">
              You're all caught up! 🎉
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <a
          href="/student/notifications"
          className="block w-full text-center py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200 shadow-sm"
        >
          View All Notifications
        </a>
      </div>
    </div>
  );
};

export default NotificationDropdown;
