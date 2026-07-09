import { useState } from "react";
import { validateDepartment } from "../../validations/departmentValidation";

const initialValues = {
  name: "",
  code: "",
  hod: "",
  totalStudents: "",
  totalCourses: "",
};

const DepartmentForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
    <div className="w-full min-h-screen bg-white p-10">
      <form
        onSubmit={handleSubmit}
        className="w-full min-h-screen bg-white p-10"
      >
        {/* Header */}
        <div className="border-b border-gray-200 pb-5 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Add Department
          </h2>
          <p className="text-gray-500 mt-2">
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
          />

          <InputField
            label="Department Code"
            name="code"
            placeholder="Enter department code"
            value={formData.code}
            onChange={handleChange}
            error={errors.code}
          />

          <InputField
            label="Head of Department"
            name="hod"
            placeholder="Enter HOD name"
            value={formData.hod}
            onChange={handleChange}
            error={errors.hod}
          />

          <InputField
            label="Total Students"
            name="totalStudents"
            type="number"
            placeholder="Enter total students"
            value={formData.totalStudents}
            onChange={handleChange}
            error={errors.totalStudents}
          />

          <InputField
            label="Total Courses"
            name="totalCourses"
            type="number"
            placeholder="Enter total courses"
            value={formData.totalCourses}
            onChange={handleChange}
            error={errors.totalCourses}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition duration-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md transition duration-200"
          >
            Save Department
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, error, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <input
        {...props}
        className={`w-full rounded-lg border px-4 py-3 text-gray-700 placeholder-gray-400 outline-none transition-all duration-200
        ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-200"
            : "border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200"
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