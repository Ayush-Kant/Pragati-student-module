import React from "react";
import { Eye, Pencil, MoreHorizontal } from "lucide-react";
import CourseStatusBadge from "./CourseStatusBadge";

const CATEGORY_STYLES = {
  "Web Development": "bg-blue-100 text-blue-700",
  "Data Science": "bg-emerald-100 text-emerald-700",
  Design: "bg-purple-100 text-purple-700",
};

export default function CourseTableRow({ course, onArchive, onView, onEdit }) {
  const categoryClass =
    CATEGORY_STYLES[course.category] || "bg-gray-100 text-gray-700";

  return (
    <tr className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <td className="rounded-l-2xl bg-white p-4">
        <div className="flex items-center gap-4">
          <img
            src={course.image}
            alt={course.title}
            className="h-16 w-16 rounded-2xl object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{course.title}</h3>
            <p className="mt-1 max-w-xs text-sm text-gray-500 line-clamp-2">
              {course.description}
            </p>
          </div>
        </div>
      </td>

      <td className="bg-white p-4">
        <span
          className={`rounded-full px-4 py-2 text-nowrap text-sm font-medium ${categoryClass}`}
        >
          {course.category}
        </span>
      </td>

      <td className="bg-white p-4">
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.mentor)}`}
            alt={course.mentor}
            className="h-11 w-11 rounded-full"
          />
          <div>
            <h4 className="font-medium text-gray-900">{course.mentor}</h4>
            <p className="text-sm text-gray-500">Mentor</p>
          </div>
        </div>
      </td>

      <td className="bg-white p-4 font-medium text-gray-700">
        {course.students}
      </td>

      <td className="bg-white p-4">
        <CourseStatusBadge status={course.status} />
      </td>

      <td className="rounded-r-2xl bg-white p-4">
        <div className="flex items-center justify-center gap-2">
          {/* View details action button connected */}
          <button
            onClick={() => onView(course.courseId)}
            className="cursor-pointer rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100"
          >
            <Eye size={18} />
          </button>

          {/* Edit details action button connected */}
          <button
            onClick={() => onEdit(course.courseId)}
            className="cursor-pointer rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100"
          >
            <Pencil size={18} />
          </button>

          <div className="group relative">
            <button className="cursor-pointer rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100">
              <MoreHorizontal size={18} />
            </button>
            <div className="absolute right-0 top-12 z-20 hidden w-44 rounded-xl border border-gray-100 bg-white p-2 shadow-xl group-hover:block before:absolute before:-top-4 before:left-0 before:h-4 before:w-full">
              <button
                onClick={() => onArchive(course.courseId)}
                className="cursor-pointer w-full rounded-lg px-4 py-2 text-left text-sm text-orange-600 transition hover:bg-orange-50"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
