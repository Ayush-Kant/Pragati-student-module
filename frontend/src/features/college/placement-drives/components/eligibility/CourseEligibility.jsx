import React from "react";
import { COURSES } from "../../constants/placementDriveConstants";

const CourseEligibility = ({ selectedCourses = [], onChange, isEditable = true }) => {
  const handleToggle = (course) => {
    if (!isEditable) return;
    if (selectedCourses.includes(course)) {
      onChange(selectedCourses.filter((c) => c !== course));
    } else {
      onChange([...selectedCourses, course]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Eligible Courses <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {COURSES.map((course) => {
          const isChecked = selectedCourses.includes(course);
          return (
            <label
              key={course}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm cursor-pointer transition-all ${
                isChecked
                  ? "border-[#ff7a00] bg-[#fff4ec] text-[#ff7a00] font-medium"
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              } ${!isEditable ? "opacity-80 cursor-default" : ""}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                disabled={!isEditable}
                onChange={() => handleToggle(course)}
                className="rounded text-[#ff7a00] focus:ring-[#ff7a00] h-4 w-4 border-gray-300"
              />
              <span>{course}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CourseEligibility;
