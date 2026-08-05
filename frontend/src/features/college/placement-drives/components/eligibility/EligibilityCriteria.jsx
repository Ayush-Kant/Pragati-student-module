import React from "react";
import DepartmentEligibility from "./DepartmentEligibility";
import CourseEligibility from "./CourseEligibility";
import BatchEligibility from "./BatchEligibility";
import CGPACriteria from "./CGPACriteria";

const EligibilityCriteria = ({
  eligibility = { departments: [], courses: [], batches: [], cgpa: 0, skills: "" },
  onChange,
  isEditable = true,
  errors = {},
  darkMode,
}) => {
  const handleChange = (field, value) => {
    if (!isEditable) return;
    onChange({
      ...eligibility,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <DepartmentEligibility
        selectedDepartments={eligibility.departments || []}
        onChange={(val) => handleChange("departments", val)}
        isEditable={isEditable}
        darkMode={darkMode}
      />
      {errors.departments && (
        <p className="text-xs text-red-500 -mt-4">{errors.departments}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <CourseEligibility
            selectedCourses={eligibility.courses || []}
            onChange={(val) => handleChange("courses", val)}
            isEditable={isEditable}
            darkMode={darkMode}
          />
          {errors.courses && (
            <p className="text-xs text-red-500 mt-1">{errors.courses}</p>
          )}
        </div>

        <div>
          <BatchEligibility
            selectedBatches={eligibility.batches || []}
            onChange={(val) => handleChange("batches", val)}
            isEditable={isEditable}
            darkMode={darkMode}
          />
          {errors.batches && (
            <p className="text-xs text-red-500 mt-1">{errors.batches}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CGPACriteria
          cgpa={eligibility.cgpa}
          onChange={(val) => handleChange("cgpa", val)}
          isEditable={isEditable}
          error={errors.cgpa}
          darkMode={darkMode}
        />

        <div className="space-y-2">
          <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Skills Requirement {isEditable && <span className={`font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>(Optional)</span>}
          </label>
          {isEditable ? (
            <input
              type="text"
              value={eligibility.skills || ""}
              onChange={(e) => handleChange("skills", e.target.value)}
              placeholder="e.g. React, Node.js, DSA"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                darkMode
                  ? 'border-[#3D3D3D] bg-[#1A1A1A] text-white placeholder-gray-500 focus:border-[#ff6d34] focus:ring-[#ff6d34]/20'
                  : 'border-gray-300 bg-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20'
              }`}
            />
          ) : (
            <div className={`text-sm font-medium p-2.5 rounded-lg border min-h-[42px] ${darkMode ? 'text-gray-300 bg-[#1A1A1A] border-[#3D3D3D]' : 'text-gray-800 bg-gray-50 border-gray-100'}`}>
              {eligibility.skills || "No specific skill set required"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityCriteria;
