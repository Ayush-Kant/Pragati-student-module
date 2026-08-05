import React from "react";
import { ROUND_STATUS } from "../../constants/placementDriveConstants";

const RoundStatus = ({ status, onChange, isEditable = true, darkMode }) => {
  const getBadgeColor = (statusVal) => {
    if (darkMode) {
      switch (statusVal) {
        case "Completed":
          return "bg-green-500/20 text-green-400 border border-green-500/30";
        case "Upcoming":
          return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
        case "Pending":
        default:
          return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      }
    }
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
      className={`text-xs border rounded-lg px-2.5 py-1.5 outline-none font-medium cursor-pointer ${
        darkMode
          ? 'bg-[#1A1A1A] border-[#3D3D3D] text-gray-200 focus:border-[#ff6d34] focus:ring-1 focus:ring-[#ff6d34]/30'
          : 'bg-white border-gray-300 text-gray-700 focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00]/30'
      }`}
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
