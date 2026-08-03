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
        />

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Skills Requirement {isEditable && <span className="text-gray-400 font-normal">(Optional)</span>}
          </label>
          {isEditable ? (
            <input
              type="text"
              value={eligibility.skills || ""}
              onChange={(e) => handleChange("skills", e.target.value)}
              placeholder="e.g. React, Node.js, DSA"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/20"
            />
          ) : (
            <div className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100 min-h-[42px]">
              {eligibility.skills || "No specific skill set required"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityCriteria;
