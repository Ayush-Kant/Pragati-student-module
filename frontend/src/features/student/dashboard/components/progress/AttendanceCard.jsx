import React from "react";
import PropTypes from "prop-types";

export default function AttendanceCard({ percentage = 0, loading }) {
  if (loading) {
    return <div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />;
  }

  const isEligible = percentage >= 75;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <span className="text-sm font-semibold text-gray-400">📅 Attendance</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isEligible ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}>
            {isEligible ? "Eligible" : "Low Attendance"}
          </span>
        </div>
        <p className="text-3xl font-bold text-gray-800 mt-2 tracking-tight">{percentage}%</p>
      </div>
      <p className="text-xs text-gray-400 mt-3">Minimum required for drives: 75%</p>
    </div>
  );
}

AttendanceCard.propTypes = {
  percentage: PropTypes.number,
  loading: PropTypes.bool,
};