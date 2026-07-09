import React from "react";

const CourseTable = ({
  courses = [],
  onView,
  onEdit,
  onDelete,
}) => {
  if (!courses.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        No Courses Available
      </div>
    );
  }

  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-sm text-gray-600">
            <th className="px-6 py-4">Course Name</th>
            <th className="px-6 py-4">Course Code</th>
            <th className="px-6 py-4">Semester</th>
            <th className="px-6 py-4">Credits</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course) => (
            <tr
              key={course.id}
              className="border-b hover:bg-orange-50 transition"
            >
              <td className="px-6 py-5 font-medium">
                {course.courseName}
              </td>

              <td className="px-6 py-5">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                  {course.courseCode}
                </span>
              </td>

              <td className="px-6 py-5">
                Semester {course.semester}
              </td>

              <td className="px-6 py-5">
                {course.credits}
              </td>

              <td className="px-6 py-5">
                <div className="flex justify-center gap-2">

  <button
    onClick={() => onView?.(course)}
    className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
  >
    View
  </button>

  <button
    onClick={() => onEdit?.(course)}
    className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
  >
    Edit
  </button>

  <button
    onClick={() => onDelete?.(course)}
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

export default CourseTable;