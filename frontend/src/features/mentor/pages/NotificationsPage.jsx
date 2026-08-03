import React, { useState } from "react";
import useNotifications from "../hooks/useNotifications";
import NotificationList from "../components/NotificationList";
import SendNotificationModal from "../components/SendNotificationModal";
import { Bell, CheckSquare, Plus, RefreshCw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function NotificationsPage() {
  const {
    notifications,
    rawNotifications,
    loading,
    error,
    filter,
    setFilter,
    unreadCount,
    markAsRead,
    markAllAsRead,
    sendNotification,
    refresh
  } = useNotifications();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    toast.success("Notification marked as read");
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) {
      toast.error("All notifications are already read");
      return;
    }
    await markAllAsRead();
    toast.success("All notifications marked as read");
  };

  const handleSendNotification = async (notificationData) => {
    const result = await sendNotification(notificationData);
    if (result.success) {
      toast.success("Notification sent successfully!");
    } else {
      toast.error(result.error || "Failed to send notification");
    }
  };

  const allCount = rawNotifications.length;
  const readCount = rawNotifications.filter((n) => n.read).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-inner flex-shrink-0">
            <Bell className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full animate-bounce">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-400 mt-1">
              Manage alerts, student submissions, questions, and system announcements.
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={refresh}
            className="flex items-center justify-center p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors bg-white shadow-sm"
            title="Refresh feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl font-bold text-xs shadow-sm transition-all ${
              unreadCount > 0
                ? "border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 bg-white cursor-pointer"
                : "border-slate-100 text-slate-300 bg-slate-50/50 cursor-not-allowed"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Send Notification</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter Row */}
      <div className="flex border-b border-slate-200 gap-1 select-none">
        {[
          { key: "All", label: "All", count: allCount },
          { key: "Unread", label: "Unread", count: unreadCount, highlight: unreadCount > 0 },
          { key: "Read", label: "Read", count: readCount }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all -mb-[2px] ${
              filter === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold leading-none ${
              filter === tab.key
                ? "bg-blue-100 text-blue-700"
                : tab.highlight
                ? "bg-blue-600 text-white animate-pulse"
                : "bg-slate-100 text-slate-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold flex items-center justify-between">
            <span>{error}</span>
            <button onClick={refresh} className="underline text-xs hover:text-red-900 ml-2">Retry</button>
          </div>
        ) : (
          <NotificationList
            notifications={notifications}
            onMarkRead={handleMarkRead}
          />
        )}
      </div>

      {/* Centered Modal */}
      <SendNotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={handleSendNotification}
      />
    </div>
  );
}
