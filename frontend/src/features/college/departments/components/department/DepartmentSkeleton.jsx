import React from "react";

const SkeletonCard = ({ darkMode }) => (
  <div className={`rounded-xl border p-6 animate-pulse ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-200'}`}>

    <div className={`h-6 w-48 rounded mb-4 ${darkMode ? 'bg-[#3D3D3D]' : 'bg-gray-200'}`}></div>

    <div className={`h-4 w-20 rounded mb-6 ${darkMode ? 'bg-[#3D3D3D]' : 'bg-gray-200'}`}></div>

    <div className="space-y-3">

      <div className={`h-4 rounded ${darkMode ? 'bg-[#3D3D3D]' : 'bg-gray-200'}`}></div>

      <div className={`h-4 rounded ${darkMode ? 'bg-[#3D3D3D]' : 'bg-gray-200'}`}></div>

      <div className={`h-4 rounded ${darkMode ? 'bg-[#3D3D3D]' : 'bg-gray-200'}`}></div>

    </div>

    <div className="flex gap-2 mt-6">

      <div className={`flex-1 h-10 rounded ${darkMode ? 'bg-[#3D3D3D]' : 'bg-gray-200'}`}></div>

      <div className={`flex-1 h-10 rounded ${darkMode ? 'bg-[#3D3D3D]' : 'bg-gray-200'}`}></div>

      <div className={`flex-1 h-10 rounded ${darkMode ? 'bg-[#3D3D3D]' : 'bg-gray-200'}`}></div>

    </div>

  </div>
);

const DepartmentSkeleton = ({ darkMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <SkeletonCard key={item} darkMode={darkMode} />
      ))}
    </div>
  );
};

export default DepartmentSkeleton;