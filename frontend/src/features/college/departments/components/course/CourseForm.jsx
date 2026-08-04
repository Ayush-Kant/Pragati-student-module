import React, { useState } from "react";

const initialState = {
  courseName: "",
  courseCode: "",
  semester: "",
  credits: "",
  departmentId: "",
};

const CourseForm = ({
  initialData = initialState,
  onSubmit,
  onCancel,
  isEdit = false,
  departments = [],
  darkMode = false,
}) => {
  const [formData, setFormData] = useState({
    ...initialState,
    ...(initialData || {}),
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course Name is required";
    }

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = "Course Code is required";
    }

    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    }

    if (!formData.credits) {
      newErrors.credits = "Credits are required";
    }

    if (!formData.departmentId) {
      newErrors.departmentId = "Department is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit?.(formData);

    setFormData(initialState);
    setErrors({});
  };

  return (
    <div
      className={`w-full min-h-screen p-10 ${
        darkMode ? "bg-[#2D2D2D]" : "bg-white"
      }`}
    >
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div
          className={`border-b pb-5 mb-8 ${
            darkMode ? "border-[#3D3D3D]" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {isEdit ? "Edit Course" : "Add Course"}
          </h2>

          <p
            className={`mt-2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {isEdit
              ? "Update the course details below."
              : "Enter the course details below."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Course Name"
            name="courseName"
            placeholder="Enter course name"
            value={formData.courseName}
            onChange={handleChange}
            error={errors.courseName}
            darkMode={darkMode}
          />

          <InputField
            label="Course Code"
            name="courseCode"
            placeholder="Enter course code"
            value={formData.courseCode}
            onChange={handleChange}
            error={errors.courseCode}
            darkMode={darkMode}
          />

          <div>
            <label
              className={`block mb-2 text-sm font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Semester
            </label>

            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition-all duration-200 ${
                errors.semester
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-200"
                  : darkMode
                  ? "border-[#3D3D3D] bg-[#1A1A1A] text-white focus:border-[#ff6d34] focus:ring-4 focus:ring-[#ff6d34]/20"
                  : "border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200"
              }`}
            >
              <option value="">Select Semester</option>

              {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>

            {errors.semester && (
              <p className="mt-2 text-sm text-red-500">
                {errors.semester}
              </p>
            )}
          </div>

          <InputField
            label="Credits"
            name="credits"
            type="number"
            placeholder="Enter credits"
            value={formData.credits}
            onChange={handleChange}
            error={errors.credits}
            darkMode={darkMode}
          />
                    {/* Department */}
          <div>
            <label
              className={`block mb-2 text-sm font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Department
            </label>

            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition-all duration-200 ${
                errors.departmentId
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-200"
                  : darkMode
                  ? "border-[#3D3D3D] bg-[#1A1A1A] text-white focus:border-[#ff6d34] focus:ring-4 focus:ring-[#ff6d34]/20"
                  : "border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200"
              }`}
            >
              <option value="">Select Department</option>

              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>

            {errors.departmentId && (
              <p className="mt-2 text-sm text-red-500">
                {errors.departmentId}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-lg border font-medium transition duration-200 ${
              darkMode
                ? "border-[#3D3D3D] text-gray-300 hover:bg-[#3D3D3D]"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#ff6d34] hover:bg-[#e85d2b] text-white font-semibold shadow-md transition duration-200"
          >
            {isEdit ? "Update Course" : "Save Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({
  label,
  error,
  darkMode,
  ...props
}) => (
  <div>
    <label
      className={`block mb-2 text-sm font-semibold ${
        darkMode ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label}
    </label>

    <input
      {...props}
      className={`w-full rounded-lg border px-4 py-3 outline-none transition-all duration-200 ${
        error
          ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-200"
          : darkMode
          ? "border-[#3D3D3D] bg-[#1A1A1A] text-white placeholder-gray-500 focus:border-[#ff6d34] focus:ring-4 focus:ring-[#ff6d34]/20"
          : "border-gray-300 text-gray-700 placeholder-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-200"
      }`}
    />

    {error && (
      <p className="mt-2 text-sm text-red-500">
        {error}
      </p>
    )}
  </div>
);

export default CourseForm;