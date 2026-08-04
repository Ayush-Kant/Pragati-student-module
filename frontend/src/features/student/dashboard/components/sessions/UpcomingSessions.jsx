import React from "react";
import PropTypes from "prop-types";

const UpcomingSessions = ({ data = [], loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="text-base font-bold text-gray-800 mb-3">🗓️ Upcoming Sessions</h3>
    {loading ? (
      <div className="flex flex-col gap-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>
    ) : data.length > 0 ? (
      <div className="flex flex-col gap-3">
        {data.map((s) => (
          <div key={s.id} className="border-l-2 border-blue-400 pl-3">
            <p className="text-sm font-semibold text-gray-800">{s.title}</p>
            <p className="text-xs text-gray-400">{s.date} · {s.time} · {s.mentor}</p>
          </div>
        ))}
      </div>
    ) : <p className="text-sm text-gray-400 italic">No upcoming sessions.</p>}
  </div>
);

UpcomingSessions.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default UpcomingSessions;