import React from "react";
import { useOutletContext } from "react-router-dom";
import { BookOpen } from "lucide-react";

const defaultCourses = [
  "B.Tech Computer Science",
  "B.Tech IT",
  "B.Tech ECE",
  "B.Tech ME",
  "M.Tech CS",
  "MCA",
];

const CourseSelector = ({ value, onChange, courses = defaultCourses }) => {
  const context = useOutletContext();
  const darkMode = context?.darkMode ?? false;

  return (
    <div className="w-full space-y-1.5">
      <label className={`block text-xs font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
        Select Course
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <BookOpen size={16} className={darkMode ? "text-slate-400" : "text-slate-500"} />
        </div>
        <select
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 text-sm rounded-2xl border outline-none transition-all appearance-none cursor-pointer ${
            darkMode
              ? "border-slate-700/60 bg-[#151D30] text-white focus:border-blue-500"
              : "border-slate-300 bg-white text-slate-900 focus:border-blue-500"
          }`}
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CourseSelector;
