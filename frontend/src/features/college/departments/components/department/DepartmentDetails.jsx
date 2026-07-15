import React from "react";

const DepartmentDetails = ({
  department,
  onClose,
}) => {
  if (!department) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[95%] max-w-2xl">

        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Department Details
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Complete department information
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-500"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <DetailItem
            title="Department Name"
            value={department.name}
          />

          <DetailItem
            title="Department Code"
            value={department.code}
          />

          <DetailItem
            title="Head of Department"
            value={department.hod}
          />

          <DetailItem
            title="Total Students"
            value={department.totalStudents}
          />

          <DetailItem
            title="Total Courses"
            value={department.totalCourses}
          />

          <DetailItem
            title="Department ID"
            value={department.id}
          />

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

const DetailItem = ({ title, value }) => (
  <div className="border rounded-lg p-4 bg-gray-50">
    <p className="text-sm text-gray-500 mb-1">
      {title}
    </p>

    <p className="font-semibold text-gray-900">
      {value}
    </p>
  </div>
);

export default DepartmentDetails;