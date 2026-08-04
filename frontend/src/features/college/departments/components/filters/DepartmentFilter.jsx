import React from "react";

const DepartmentFilter = ({
  value,
  onChange,
  options = [],
  darkMode,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:ring-2 ${
        darkMode
          ? 'border border-[#3D3D3D] bg-[#1A1A1A] text-white focus:ring-[#ff6d34] focus:border-[#ff6d34]'
          : 'border border-gray-300 focus:ring-orange-400 focus:border-orange-400'
      }`}
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