import React from "react";
import PropTypes from "prop-types";

export default function AnnouncementCard({ announcement }) {
  if (!announcement) return null;
  return (
    <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 mb-2">
      <span className="font-bold">📢 Announcement: </span>
      {announcement.title || announcement.message}
    </div>
  );
}

AnnouncementCard.propTypes = { announcement: PropTypes.object };