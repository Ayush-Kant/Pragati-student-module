import React from "react";
import PropTypes from "prop-types";

export default function CalendarPreview({ events = [], loading }) {
  if (loading) return <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h4 className="text-sm font-bold text-gray-800 mb-3">📅 Upcoming Events Calendar</h4>
      {events.length > 0 ? (
        <div className="space-y-2">
          {events.slice(0, 3).map((evt, idx) => (
            <div key={evt.id || idx} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{evt.title || evt.name}</span>
              <span className="text-gray-400 font-semibold">{evt.date || evt.time || "Scheduled"}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">No events scheduled on calendar.</p>
      )}
    </div>
  );
}

CalendarPreview.propTypes = { events: PropTypes.array, loading: PropTypes.bool };