import { useState } from "react";
import NotificationItem from "../../components/notifications/NotificationItem";

const mockNotifications = {
  notifications: [
    {
      notificationId: "n-001",
      title: "New Session Scheduled",
      message: "React Deep Dive session is scheduled for 10 Feb at 10:00 AM",
      type: "session",
      isRead: false,
      createdAt: "2025-02-08T08:00:00.000Z",
      time: "2 min ago",
    },
    {
      notificationId: "n-002",
      title: "Assignment Due Tomorrow",
      message: "Build Todo App assignment is due on 8 Feb 11:59 PM",
      type: "assignment",
      isRead: false,
      createdAt: "2025-02-07T10:00:00.000Z",
      time: "10 min ago",
    },
    {
      notificationId: "n-003",
      title: "Drive Enrollment Open",
      message:
        "SDE Internship Drive enrollment is now open. Apply before 15 Feb.",
      type: "drive",
      isRead: true,
      createdAt: "2025-02-06T09:00:00.000Z",
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

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const filteredNotifications =
    activeFilter === "All"
      ? mockNotifications.notifications
      : activeFilter === "Unread"
        ? mockNotifications.notifications.filter(
            (item) => item.isRead === false,
          )
        : mockNotifications.notifications.filter(
            (item) =>
              item.type.toLowerCase() ===
              activeFilter.toLowerCase().slice(0, -1),
          );
  return (
    <div className="bg-[#f5f7fb] min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[38px] font-bold text-[#0f172a] leading-none">
                Notifications
              </h1>

              <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {mockNotifications.pagination.unreadCount}
              </span>
            </div>

            <p className="text-gray-500 mt-3 text-[18px]">
              View all your latest notifications
            </p>
          </div>

          <button className="bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-[16px] font-semibold shadow-md transition">
            Mark All as Read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-5">
          {["All", "Unread", "Sessions", "Assignments", "Drive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition
      ${
        activeFilter === tab
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-black border-gray-300"
      }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="h-[450px] overflow-y-auto pr-6 space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.notificationId}
                notification={notification}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🔔</div>

              <p className="text-gray-500 text-lg font-medium">
                No notifications found
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="px-5 py-2 rounded-xl border bg-white hover:bg-gray-50">
            Previous
          </button>

          <button className="px-5 py-2 rounded-xl border bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
