import React from "react";

const CourseCard = ({
  course,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

      <div className="flex justify-between items-center">

        <div>

          <h3 className="text-lg font-bold text-gray-900">
            {course.courseName}
          </h3>

          <span className="inline-block mt-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
            {course.courseCode}
          </span>

        </div>

        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
          {course.semester}
        </div>

      </div>

      <div className="mt-6 space-y-3">

        <div className="flex justify-between">
          <span className="text-gray-500">
            Semester
          </span>

          <span className="font-medium">
            {course.semester}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Credits
          </span>

          <span className="font-medium">
            {course.credits}
          </span>
        </div>

      </div>

      <div className="flex gap-3 mt-6">

        <button
          onClick={() => onEdit?.(course)}
          className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete?.(course)}
          className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200"
        >
          Delete
        </button>

      </div>

    </div>
  );
};

export default CourseCard;