import React from "react";
import PropTypes from "prop-types";

export default function BadgeCard({ badge = "Top Performer", icon = "🥇" }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
      <span>{icon}</span>
      <span>{badge}</span>
    </div>
  );
}

BadgeCard.propTypes = { badge: PropTypes.string, icon: PropTypes.string };