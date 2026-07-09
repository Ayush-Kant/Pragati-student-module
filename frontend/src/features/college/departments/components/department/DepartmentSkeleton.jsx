import React from "react";

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">

    <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>

    <div className="h-4 w-20 bg-gray-200 rounded mb-6"></div>

    <div className="space-y-3">

      <div className="h-4 bg-gray-200 rounded"></div>

      <div className="h-4 bg-gray-200 rounded"></div>

      <div className="h-4 bg-gray-200 rounded"></div>

    </div>

    <div className="flex gap-2 mt-6">

      <div className="flex-1 h-10 bg-gray-200 rounded"></div>

      <div className="flex-1 h-10 bg-gray-200 rounded"></div>

      <div className="flex-1 h-10 bg-gray-200 rounded"></div>

    </div>

  </div>
);

const DepartmentSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <SkeletonCard key={item} />
      ))}
    </div>
  );
};

export default DepartmentSkeleton;