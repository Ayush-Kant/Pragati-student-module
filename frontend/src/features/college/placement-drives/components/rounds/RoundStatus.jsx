import React from "react";
import { ROUND_STATUS } from "../../constants/placementDriveConstants";

const RoundStatus = ({ status, onChange, isEditable = true }) => {
  const getBadgeColor = (statusVal) => {
    switch (statusVal) {
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Upcoming":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  if (!isEditable) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBadgeColor(
          status
        )}`}
      >
        {status || "Pending"}
      </span>
    );
  }

  return (
    <select
      value={status || "Pending"}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00]/30 outline-none text-gray-700 font-medium cursor-pointer"
    >
      {ROUND_STATUS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
};

export default RoundStatus;
