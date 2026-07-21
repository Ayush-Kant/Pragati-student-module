import React from "react";
import PropTypes from "prop-types";

const NotificationList = ({ data = [], loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400 italic py-2">No notifications.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((n) => (
        <div key={n.id || n.message} className="flex items-start gap-2.5 p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-gray-300" : "bg-blue-500"}`} />
          <div>
            <p className="text-sm text-gray-700 leading-snug">{n.message || n.title}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{n.time || n.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

NotificationList.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default NotificationList;