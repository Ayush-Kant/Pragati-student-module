import React from "react";
import PropTypes from "prop-types";

const ProgressRing = ({ data, loading }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
      <h3 className="text-base font-bold text-gray-800 mb-3">📈 Progress</h3>
      
      {loading ? (
        <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
      ) : data ? (
        <div className="flex flex-col gap-3">
          {Object.entries(data).map(([key, val]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-semibold text-gray-700">{val}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                {/* 🚀 Pure Tailwind arbitrary width assignment replaces raw style objects */}
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: `${val}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

ProgressRing.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};

export default ProgressRing;