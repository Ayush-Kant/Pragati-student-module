import React from "react";

const DepartmentOverview = ({ departments = [] }) => {
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
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Students",
      value: totalStudents,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Courses",
      value: totalCourses,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">
                {card.title}
              </p>

              <h2 className="text-3xl font-bold mt-2 text-gray-900">
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