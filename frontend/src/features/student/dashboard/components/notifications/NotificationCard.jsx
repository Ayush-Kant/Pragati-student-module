import React from "react";
import { formatDate, formatStatus } from "../../utils/dashboardHelpers";


export default function NotificationCard({ notification }) {

  return (

    <div className="bg-white rounded-2xl p-5 shadow-md border-l-4 border-green-500 hover:shadow-xl transition">


      <div className="flex justify-between items-start">


        <h3 className="text-lg font-bold text-gray-800">
          {notification.title}
        </h3>


        {notification.status === "unread" && (

          <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
            New
          </span>

        )}


      </div>



      <p className="text-gray-600 mt-3">
        {notification.message}
      </p>



      <p className="text-gray-500 mt-3">
        📅 {formatDate(notification.date)}
      </p>



      <span className="inline-block mt-3 px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
        {formatStatus(notification.status)}
      </span>


    </div>

  );
}