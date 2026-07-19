import React from "react";
import PropTypes from "prop-types";
import ActivityCard from "./ActivityCard";
import DeadlinesCard from "./DeadlinesCard";

export default function UpcomingActivities({ sessions = [], tasks = [], loading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <h3 className="text-base font-bold text-gray-800 mb-4">🗓️ Upcoming Activities</h3>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.slice(0, 3).map((s) => (
              <ActivityCard 
                key={s.id}
                title={s.title}
                subtitle={s.mentor}
                time={`${s.date} @ ${s.time}`}
                type="Session"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No upcoming actions scheduled.</p>
        )}
      </div>
      
      <div className="md:col-span-1">
        <DeadlinesCard tasks={tasks} loading={loading} />
      </div>
    </div>
  );
}

UpcomingActivities.propTypes = {
  sessions: PropTypes.array,
  tasks: PropTypes.array,
  loading: PropTypes.bool,
};