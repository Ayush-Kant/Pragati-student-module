import React from "react";
import PropTypes from "prop-types";

const QuickStats = ({ data, loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="text-base font-bold text-gray-800 mb-3">📊 Quick Stats</h3>
    {loading ? (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
      </div>
    ) : data ? (
      <div className="grid grid-cols-2 gap-3">
        <div><p className="text-xl font-bold text-gray-800">{data.applicationsSubmitted}</p><p className="text-xs text-gray-400">Applications</p></div>
        <div><p className="text-xl font-bold text-gray-800">{data.interviewsScheduled}</p><p className="text-xs text-gray-400">Interviews</p></div>
        <div><p className="text-xl font-bold text-gray-800">{data.offersReceived}</p><p className="text-xs text-gray-400">Offers</p></div>
        <div><p className="text-xl font-bold text-gray-800">{data.profileCompletion}%</p><p className="text-xs text-gray-400">Profile</p></div>
      </div>
    ) : null}
  </div>
);

QuickStats.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};

export default QuickStats;