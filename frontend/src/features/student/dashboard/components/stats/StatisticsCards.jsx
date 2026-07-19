import React from 'react';
import PropTypes from 'prop-types';

export default function StatisticsCards({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const metrics = [
    { label: "Applications", value: data?.applicationsSubmitted || 0, color: "text-blue-600 bg-blue-50" },
    { label: "Interviews", value: data?.interviewsScheduled || 0, color: "text-orange-600 bg-orange-50" },
    { label: "Offers", value: data?.offersReceived || 0, color: "text-green-600 bg-green-50" },
    { label: "Profile Setup", value: `${data?.profileCompletion || 0}%`, color: "text-purple-600 bg-purple-50" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {metrics.map((item, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
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