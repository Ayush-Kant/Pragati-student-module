import React from "react";

const CourseOverview = ({ courses = [], darkMode }) => {
  const totalCourses = courses.length;

  const totalCredits = courses.reduce(
    (sum, course) => sum + Number(course.credits),
    0
  );

  const averageCredits =
    totalCourses > 0
      ? (totalCredits / totalCourses).toFixed(1)
      : 0;

  const semesters = [
    ...new Set(courses.map((course) => course.semester)),
  ].length;

  const cards = [
    {
      title: "Total Courses",
      value: totalCourses,
      color: darkMode ? "bg-[#ff6d34]/20 text-[#ff6d34]" : "bg-orange-100 text-orange-600",
    },
    {
      title: "Average Credits",
      value: averageCredits,
      color: darkMode ? "bg-[#00bea3]/20 text-[#00bea3]" : "bg-teal-100 text-teal-600",
    },
    {
      title: "Semesters",
      value: semesters,
      color: darkMode ? "bg-[#00bea3]/20 text-[#00bea3]" : "bg-teal-100 text-teal-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white border border-gray-100'}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {card.title}
              </p>

              <h2 className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : ''}`}>
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

export default CourseOverview;