import React from "react";

const DepartmentDetails = ({
  department,
  onClose,
  darkMode,
}) => {
  if (!department) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`rounded-xl shadow-lg w-[95%] max-w-2xl ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>

        {/* Header */}
        <div className={`flex justify-between items-center border-b px-6 py-4 ${darkMode ? 'border-[#3D3D3D]' : ''}`}>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Department Details
            </h2>

            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Complete department information
            </p>
          </div>

          <button
            onClick={onClose}
            className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <DetailItem title="Department Name" value={department.name} darkMode={darkMode} />

          <DetailItem title="Department Code" value={department.code} darkMode={darkMode} />

          <DetailItem title="Head of Department" value={department.hod} darkMode={darkMode} />

          <DetailItem title="Total Students" value={department.totalStudents} darkMode={darkMode} />

          <DetailItem title="Total Courses" value={department.totalCourses} darkMode={darkMode} />

          <DetailItem title="Department ID" value={department.id} darkMode={darkMode} />

        </div>

        {/* Footer */}
        <div className={`flex justify-end border-t px-6 py-4 ${darkMode ? 'border-[#3D3D3D]' : ''}`}>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#ff6d34] hover:bg-[#e85d2b] text-white rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

const DetailItem = ({ title, value, darkMode }) => (
  <div className={`border rounded-lg p-4 ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D]' : 'bg-gray-50'}`}>
    <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      {title}
    </p>

    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {value}
    </p>
  </div>
);

export default DepartmentDetails;