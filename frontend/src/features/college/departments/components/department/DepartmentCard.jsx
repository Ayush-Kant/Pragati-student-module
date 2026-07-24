import React from "react";

const DepartmentCard = ({
  department,
  onView,
  onEdit,
  onDelete,
  darkMode,
}) => {
  return (
    <div className={`rounded-xl shadow-sm p-5 hover:shadow-md transition ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white border border-gray-100'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {department.name}
          </h3>

          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34]' : 'bg-orange-100 text-orange-600'}`}>
            {department.code}
          </span>
        </div>

        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34]' : 'bg-orange-100 text-orange-600'}`}>
          {department.code}
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>HOD</span>
          <span className={`font-medium ${darkMode ? 'text-gray-200' : ''}`}>{department.hod}</span>
        </div>

        <div className="flex justify-between">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Students
          </span>

          <span className={`font-semibold ${darkMode ? 'text-white' : ''}`}>
            {department.totalStudents}
          </span>
        </div>

        <div className="flex justify-between">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Courses
          </span>

          <span className={`font-semibold ${darkMode ? 'text-white' : ''}`}>
            {department.totalCourses}
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => onView?.(department)}
          className={`flex-1 py-2 rounded-lg ${darkMode ? 'bg-[#00bea3]/20 text-[#00bea3] hover:bg-[#00bea3]/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
        >
          View
        </button>

        <button
          onClick={() => onEdit?.(department)}
          className={`flex-1 py-2 rounded-lg ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34] hover:bg-[#ff6d34]/30' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
        >
          Edit
        </button>

        <button
          onClick={() => onDelete?.(department)}
          className={`flex-1 py-2 rounded-lg ${darkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;