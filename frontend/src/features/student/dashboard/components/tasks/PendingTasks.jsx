import React from "react";
import PropTypes from "prop-types";

const PendingTasks = ({ data = [], loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="text-base font-bold text-gray-800 mb-3">✅ Pending Tasks</h3>
    {loading ? (
      <div className="flex flex-col gap-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />)}</div>
    ) : data.length > 0 ? (
      <div className="flex flex-col gap-2">
        {data.map((t) => (
          <div key={t.id} className="flex items-center gap-2 text-sm">
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${t.done ? "bg-green-500 border-green-500 text-white" : "border-gray-300"}`}>
              {t.done && "✓"}
            </span>
            <span className={t.done ? "text-gray-400 line-through" : "text-gray-700"}>{t.title}</span>
          </div>
        ))}
      </div>
    ) : <p className="text-sm text-gray-400 italic">No pending tasks.</p>}
  </div>
);

PendingTasks.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default PendingTasks;