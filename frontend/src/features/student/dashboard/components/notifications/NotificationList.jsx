import React from "react";
import PropTypes from "prop-types";
import NotificationCard from "./NotificationCard";

const NotificationList = ({ data = [], loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400 italic py-2 text-center">No notifications available.</p>;
  }

  return (
    <div className="flex flex-col gap-1 divide-y divide-gray-50">
      {data.map((item, idx) => (
        <NotificationCard
          key={item.id || item.title || idx}
          notification={item}
        />
      ))}
    </div>
  );
};

NotificationList.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default NotificationList;