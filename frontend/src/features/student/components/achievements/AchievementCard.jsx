import React from "react";
import PropTypes from "prop-types";

export default function AchievementCard({ title = "Achievement Unlocked", description = "" }) {
  return (
    <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 flex items-center gap-3">
      <span className="text-2xl">🏆</span>
      <div>
        <h5 className="text-xs font-bold text-purple-900">{title}</h5>
        {description && <p className="text-[11px] text-purple-700 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

AchievementCard.propTypes = { title: PropTypes.string, description: PropTypes.string };