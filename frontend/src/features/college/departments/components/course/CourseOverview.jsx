import React from "react";

const CourseOverview = ({ courses = [] }) => {
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
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Average Credits",
      value: averageCredits,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Semesters",
      value: semesters,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">
                {card.title}
              </p>

              <h2 className="text-3xl font-bold mt-2">
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