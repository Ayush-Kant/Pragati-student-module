import React from "react";
import { Link } from "react-router-dom";

export default function RecentNotifications({ notifications = [] }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Recent Notifications</h3>
        <Link to="/student/notifications" className="text-xs font-semibold text-blue-600 hover:underline">
          View All →
        </Link>
      </div>

      {!notifications.length ? (
        <p className="text-sm text-gray-500">No new notifications.</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className="p-3 bg-gray-50 rounded-lg border text-sm flex items-center justify-between">
              <span className="text-gray-800">{n.title}</span>
              {!n.readAt && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}