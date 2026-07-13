import React from "react";
import {
  PLACEMENT_STATUS_COLORS,
  INTERVIEW_ROUND_STATUS_COLORS,
  OFFER_STATUS_COLORS,
  SKILL_PROFICIENCY_LEVELS
} from "../../constants/studentProfileConstants";

export const StatusBadge = ({ status, type = "placement" }) => {
  if (!status) return null;

  let colorClass = "bg-gray-50 text-gray-700 border border-gray-100/80";

  if (type === "placement") {
    colorClass = PLACEMENT_STATUS_COLORS[status] || colorClass;
  } else if (type === "interview") {
    colorClass = INTERVIEW_ROUND_STATUS_COLORS[status] || colorClass;
  } else if (type === "offer") {
    colorClass = OFFER_STATUS_COLORS[status] || colorClass;
  } else if (type === "proficiency") {
    colorClass = SKILL_PROFICIENCY_LEVELS[status] || colorClass;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
