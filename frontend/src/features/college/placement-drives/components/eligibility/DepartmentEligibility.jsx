import React from "react";
import { DEPARTMENTS } from "../../constants/placementDriveConstants";

const DepartmentEligibility = ({ selectedDepartments = [], onChange, isEditable = true, darkMode }) => {
  const handleToggle = (dept) => {
    if (!isEditable) return;
    if (selectedDepartments.includes(dept)) {
      onChange(selectedDepartments.filter((d) => d !== dept));
    } else {
      onChange([...selectedDepartments, dept]);
    }
  };

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Eligible Departments <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {DEPARTMENTS.map((dept) => {
          const isChecked = selectedDepartments.includes(dept);
          return (
            <label
              key={dept}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm cursor-pointer transition-all ${
                isChecked
                  ? darkMode
                    ? "border-[#ff6d34] bg-[#ff6d34]/10 text-[#ff6d34] font-medium"
                    : "border-[#ff7a00] bg-[#fff4ec] text-[#ff7a00] font-medium"
                  : darkMode
                    ? "border-[#3D3D3D] hover:bg-[#2D2D2D] text-gray-400"
                    : "border-gray-200 hover:bg-gray-50 text-gray-600"
              } ${!isEditable ? "opacity-80 cursor-default" : ""}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                disabled={!isEditable}
                onChange={() => handleToggle(dept)}
                className="rounded text-[#ff7a00] focus:ring-[#ff7a00] h-4 w-4 border-gray-300"
              />
              <span>{dept}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentEligibility;
