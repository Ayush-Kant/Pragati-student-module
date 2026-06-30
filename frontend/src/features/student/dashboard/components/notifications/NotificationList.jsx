import React from "react";
import NotificationCard from "./NotificationCard";
import { getEmptyMessage } from "../../utils/dashboardHelpers";
import { recentNotificationsData } from "../../data/dashboardData";


export default function NotificationList() {

  if (recentNotificationsData.length === 0) {
    return (
      <p>
        {getEmptyMessage("notifications")}
      </p>
    );
  }


  return (
    <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Notifications
      </h2>


      <div className="grid md:grid-cols-2 gap-5">

        {recentNotificationsData.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
          />
        ))}

      </div>

    </div>
  );
}