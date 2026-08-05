import { useState } from "react";
import { validateDepartment } from "../../validations/departmentValidation";

const initialValues = {
  name: "",
  code: "",
  hod: "",
  totalStudents: "",
  totalCourses: "",
};

const DepartmentForm = ({ onSubmit, onCancel, darkMode }) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
  e.target.type === "number"
    ? Number(e.target.value)
    : e.target.value
    }));

    // Clear error while typing
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateDepartment(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit?.(formData);

    setFormData(initialValues);
    setErrors({});
  };

  return (
    <div className={`w-full min-h-screen p-10 ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'}`}>
      <form
        onSubmit={handleSubmit}
        className={`w-full min-h-screen p-10 ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'}`}
      >
        {/* Header */}
        <div className={`border-b pb-5 mb-8 ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-200'}`}>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Add Department
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Enter the department details below.
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Department Name"
            name="name"
            placeholder="Enter department name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            darkMode={darkMode}
          />

          <InputField
            label="Department Code"
            name="code"
            placeholder="Enter department code"
            value={formData.code}
            onChange={handleChange}
            error={errors.code}
            darkMode={darkMode}
          />

          <InputField
            label="Head of Department"
            name="hod"
            placeholder="Enter HOD name"
            value={formData.hod}
            onChange={handleChange}
            error={errors.hod}
            darkMode={darkMode}
          />

          <InputField
            label="Total Students"
            name="totalStudents"
            type="number"
            placeholder="Enter total students"
            value={formData.totalStudents}
            onChange={handleChange}
            error={errors.totalStudents}
            darkMode={darkMode}
          />

          <InputField
            label="Total Courses"
            name="totalCourses"
            type="number"
            placeholder="Enter total courses"
            value={formData.totalCourses}
            onChange={handleChange}
            error={errors.totalCourses}
            darkMode={darkMode}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-lg border font-medium transition duration-200 ${darkMode ? 'border-[#3D3D3D] text-gray-300 hover:bg-[#3D3D3D]' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#ff6d34] hover:bg-[#e85d2b] text-white font-semibold shadow-md transition duration-200"
          >
            Save Department
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, error, darkMode, ...props }) => {
  return (
    <div>
      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>

      <input
        {...props}
        className={`w-full rounded-lg border px-4 py-3 outline-none transition-all duration-200
        ${
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
};

export default DepartmentForm;