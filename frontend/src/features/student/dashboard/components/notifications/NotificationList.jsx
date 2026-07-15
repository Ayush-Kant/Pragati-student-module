import React from "react";
import PropTypes from "prop-types";

const NotificationsList = ({ data = [], loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="text-base font-bold text-gray-800 mb-3">🔔 Recent Notifications</h3>
    {loading ? (
      <div className="flex flex-col gap-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}</div>
    ) : data.length > 0 ? (
      <div className="flex flex-col gap-3">
        {data.map((n) => (
          <div key={n.id} className="flex items-start gap-2">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-gray-300" : "bg-blue-500"}`} />
            <div>
              <p className="text-sm text-gray-700">{n.message}</p>
              <p className="text-xs text-gray-400">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    ) : <p className="text-sm text-gray-400 italic">No notifications.</p>}
  </div>
);

NotificationsList.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default NotificationsList;