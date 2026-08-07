import React from "react";
import PropTypes from "prop-types";
import NotificationList from "./NotificationList";

export default function NotificationPanel({ data = [], loading }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">🔔 Recent Notifications</h3>
        {data.length > 0 && (
          <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full">
            {data.filter(n => !n.read).length} New
          </span>
        )}
      </div>
      
      <NotificationList data={data} loading={loading} />
    </div>
  );
}

NotificationPanel.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};