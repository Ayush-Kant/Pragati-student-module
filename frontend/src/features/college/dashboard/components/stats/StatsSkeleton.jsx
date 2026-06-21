import React from "react";

const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>

          <div className="h-8 bg-gray-200 rounded w-20 mb-4"></div>

          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      ))}
    </div>
  );
};

export default StatsSkeleton;