import React from "react";
import PropTypes from "prop-types";

export default function StatisticsCards({ data = {}, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`stat-skeleton-${i + 1}`} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  // Robust data mappings with fallbacks to avoid displaying 0 or undefined incorrectly
  const metrics = [
    {
      id: "stat-applications",
      label: "Applications",
      value: data?.appliedDrives ?? data?.applicationsSubmitted ?? data?.applications ?? 0,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "stat-interviews",
      label: "Interviews",
      value: data?.upcomingInterviews ?? data?.interviewsScheduled ?? data?.interviews ?? 0,
      color: "text-orange-600 bg-orange-50",
    },
    {
      id: "stat-shortlisted",
      label: "Shortlisted",
      value: data?.shortlistedDrives ?? data?.offersReceived ?? data?.shortlisted ?? 0,
      color: "text-green-600 bg-green-50",
    },
    {
      id: "stat-attendance",
      label: "Attendance",
      value: `${data?.attendancePercentage ?? data?.profileCompletion ?? 0}%`,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {metrics.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between"
        >
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-max ${item.color}`}>
            {item.label}
          </span>
          <p className="text-2xl font-bold text-gray-800 mt-3 tracking-tight">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

StatisticsCards.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};