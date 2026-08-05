import React from "react";
import PropTypes from "prop-types";
import { formatDate, formatStatus } from "../../utils/dashboardHelpers";

export default function NotificationCard({ notification }) {
  if (!notification) return null;

  const title = notification.title || "Notification";
  const message = notification.message || "";
  const status = notification.status || (notification.read ? "read" : "unread");
  const rawDate = notification.date || notification.time || notification.createdAt;

  return (
    <div className="flex items-start justify-between gap-3 p-3 hover:bg-gray-50/80 rounded-xl transition-colors border-b border-gray-50 last:border-none">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-800">
            {title}
          </h4>
          {status === "unread" && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              New
            </span>
          )}
        </div>

        {message && (
          <p className="text-xs text-gray-600 mt-1 leading-normal">
            {message}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <span className="text-[11px] text-gray-400">
            📅 {formatDate(rawDate)}
          </span>

          {status && (
            <span className="inline-block px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-medium">
              {formatStatus(status)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    message: PropTypes.string,
    status: PropTypes.string,
    read: PropTypes.bool,
    date: PropTypes.string,
    time: PropTypes.string,
    createdAt: PropTypes.string,
  }),
};