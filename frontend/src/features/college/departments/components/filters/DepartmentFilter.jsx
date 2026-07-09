import React from "react";

const DepartmentFilter = ({
  value,
  onChange,
  options = [],
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
    >
      <option value="">All Departments</option>

      {options.map((department) => (
        <option
          key={department.id}
          value={department.code}
        >
          {department.name}
        </option>
      ))}
    </select>
  );
};

export default DepartmentFilter;