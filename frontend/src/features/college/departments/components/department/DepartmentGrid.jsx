import React from "react";
import DepartmentCard from "./DepartmentCard";

const DepartmentGrid = ({
  departments = [],
  onView,
  onEdit,
  onDelete,
}) => {
  if (!departments.length) {
    return (
      <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
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
        />
      ))}
    </div>
  );
};

export default DepartmentGrid;