import React from "react";

const DepartmentCard = ({
  department,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">
            {department.name}
          </h3>

          <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
            {department.code}
          </span>
        </div>

        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
          {department.code}
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">HOD</span>
          <span className="font-medium">{department.hod}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Students
          </span>

          <span className="font-semibold">
            {department.totalStudents}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Courses
          </span>

          <span className="font-semibold">
            {department.totalCourses}
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => onView?.(department)}
          className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200"
        >
          View
        </button>

        <button
          onClick={() => onEdit?.(department)}
          className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete?.(department)}
          className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;