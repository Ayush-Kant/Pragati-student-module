import React from "react";

const DepartmentTable = ({
  departments = [],
  onView,
  onEdit,
  onDelete,
}) => {
  if (!departments.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
        No Departments Found
      </div>
    );
  }

  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-sm text-gray-600">
            <th className="px-6 py-4">Department</th>
            <th className="px-6 py-4">Code</th>
            <th className="px-6 py-4">HOD</th>
            <th className="px-6 py-4">Students</th>
            <th className="px-6 py-4">Courses</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((department) => (
            <tr
              key={department.id}
              className="border-b hover:bg-orange-50 transition"
            >
              <td className="px-6 py-5 font-semibold text-gray-800">
                {department.name}
              </td>

              <td className="px-6 py-5">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                  {department.code}
                </span>
              </td>

              <td className="px-6 py-5">{department.hod}</td>

              <td className="px-6 py-5">
                {department.totalStudents}
              </td>

              <td className="px-6 py-5">
                {department.totalCourses}
              </td>

              <td className="px-6 py-5">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onView?.(department)}
                    className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    View
                  </button>

                  <button
                    onClick={() => onEdit?.(department)}
                    className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete?.(department)}
                    className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentTable;