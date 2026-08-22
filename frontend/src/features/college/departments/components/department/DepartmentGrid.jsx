import React from "react";
import DepartmentCard from "./DepartmentCard";

const DepartmentGrid = ({
  departments = [],
  onView,
  onEdit,
  onDelete,
  darkMode,
}) => {
  if (!departments.length) {
    return (
      <div className={`lg:hidden rounded-xl border p-8 text-center ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D] text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
        No Departments Found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
      {departments.map((department) => (
        <DepartmentCard
          key={department.id}
          department={department}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

export default DepartmentGrid;