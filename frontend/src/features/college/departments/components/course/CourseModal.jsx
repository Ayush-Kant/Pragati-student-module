import React from "react";
import CourseForm from "./CourseForm";

const CourseModal = ({
  isOpen,
  onClose,
  course,
  onSubmit,
  departments,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-lg w-[95%] max-w-2xl">

        <div className="flex justify-between items-center border-b p-6">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              {course ? "Edit Course" : "Add Course"}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Fill in the course information.
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-red-500"
          >
            ×
          </button>

        </div>

        <div className="p-6">

          <CourseForm
  initialData={course}
  isEdit={!!course}
  departments={departments}
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