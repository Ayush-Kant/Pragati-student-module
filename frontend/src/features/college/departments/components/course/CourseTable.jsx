import React from "react";

const CourseTable = ({
  courses = [],
  onView,
  onEdit,
  onDelete,
  darkMode,
}) => {
  if (!courses.length) {
    return (
      <div className={`rounded-xl border p-8 text-center ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D] text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
        No Courses Available
      </div>
    );
  }

  return (
    <div className={`hidden lg:block rounded-xl shadow-sm overflow-hidden ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white border border-gray-100'}`}>
      <table className="w-full">
        <thead className={`border-b ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D]' : 'bg-gray-50'}`}>
          <tr className={`text-left text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
              className={`border-b transition ${darkMode ? 'border-[#3D3D3D] hover:bg-[#1A1A1A]' : 'hover:bg-orange-50'}`}
            >
              <td className={`px-6 py-5 font-medium ${darkMode ? 'text-white' : ''}`}>
                {course.courseName}
              </td>

              <td className="px-6 py-5">
                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34]' : 'bg-orange-100 text-orange-600'}`}>
                  {course.courseCode}
                </span>
              </td>

              <td className={`px-6 py-5 ${darkMode ? 'text-gray-300' : ''}`}>
                Semester {course.semester}
              </td>

              <td className={`px-6 py-5 ${darkMode ? 'text-gray-200' : ''}`}>
                {course.credits}
              </td>

              <td className="px-6 py-5">
                <div className="flex justify-center gap-2">

  <button
    onClick={() => onView?.(course)}
    className={`px-3 py-1 rounded ${darkMode ? 'bg-[#00bea3]/20 text-[#00bea3] hover:bg-[#00bea3]/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
  >
    View
  </button>

  <button
    onClick={() => onEdit?.(course)}
    className={`px-3 py-1 rounded ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34] hover:bg-[#ff6d34]/30' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
  >
    Edit
  </button>

  <button
    onClick={() => onDelete?.(course)}
    className={`px-3 py-1 rounded ${darkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
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