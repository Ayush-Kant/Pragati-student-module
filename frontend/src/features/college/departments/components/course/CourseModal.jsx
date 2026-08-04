import React from "react";
import CourseForm from "./CourseForm";

const CourseModal = ({
  isOpen,
  onClose,
  course,
  onSubmit,
  departments = [],
  darkMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div
        className={`rounded-xl shadow-lg w-[95%] max-w-2xl ${
          darkMode
            ? "bg-[#2D2D2D] border border-[#3D3D3D]"
            : "bg-white"
        }`}
      >
        <div
          className={`flex justify-between items-center border-b p-6 ${
            darkMode ? "border-[#3D3D3D]" : ""
          }`}
        >
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {course ? "Edit Course" : "Add Course"}
            </h2>

            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Fill in the course information.
            </p>
          </div>

          <button
            onClick={onClose}
            className={`text-3xl ${
              darkMode
                ? "text-gray-400 hover:text-red-400"
                : "text-gray-500 hover:text-red-500"
            }`}
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <CourseForm
            initialData={course}
            isEdit={!!course}
            departments={departments}
            darkMode={darkMode}
            onSubmit={(data) => {
              onSubmit?.(data);
              onClose?.();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseModal;