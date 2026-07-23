import React from "react";

const DepartmentOverview = ({ departments = [], darkMode }) => {
  const totalDepartments = departments.length;

  const totalStudents = departments.reduce(
  (sum, department) => sum + Number(department.totalStudents),
  0
);

  const totalCourses = departments.reduce(
  (sum, department) => sum + Number(department.totalCourses),
  0
);

  const cards = [
    {
      title: "Departments",
      value: totalDepartments,
      color: darkMode ? "bg-[#ff6d34]/20 text-[#ff6d34]" : "bg-orange-100 text-orange-600",
    },
    {
      title: "Students",
      value: totalStudents,
      color: darkMode ? "bg-[#00bea3]/20 text-[#00bea3]" : "bg-teal-100 text-teal-600",
    },
    {
      title: "Courses",
      value: totalCourses,
      color: darkMode ? "bg-[#00bea3]/20 text-[#00bea3]" : "bg-teal-100 text-teal-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl shadow-sm p-6 hover:shadow-md transition ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white border border-gray-100'}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {card.title}
              </p>

              <h2 className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {card.value}
              </h2>
            </div>

            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold ${card.color}`}
            >
              {card.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentOverview;