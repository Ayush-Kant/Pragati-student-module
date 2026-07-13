import { useState } from "react";
import { Plus } from "lucide-react";

export default function HiringContentTab({ data }) {
  const [courses] = useState(data.courses);
  const [projects] = useState(data.projects);

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* Courses */}

      <div className="border rounded-xl bg-white p-5">

        <div className="flex justify-between items-center mb-5">

          <div>

            <h2 className="text-lg font-semibold">
              Required Courses
            </h2>

            <p className="text-gray-500 text-sm">
              Courses students must complete.
            </p>

          </div>

          <button className="border rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-100">
            <Plus size={16} />
            Add Course
          </button>

        </div>

        <div className="space-y-3">

          {courses.map((course) => (

            <div
              key={course.id}
              className="border rounded-lg p-3 flex justify-between items-center"
            >

              <div>

                <h3 className="font-medium">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {course.category}
                </p>

              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  course.required
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {course.required ? "Required" : "Optional"}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Projects */}

      <div className="border rounded-xl bg-white p-5">

        <div className="flex justify-between items-center mb-5">

          <div>

            <h2 className="text-lg font-semibold">
              Required Projects
            </h2>

            <p className="text-gray-500 text-sm">
              Portfolio projects for hiring.
            </p>

          </div>

          <button className="border rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-100">
            <Plus size={16} />
            Add Project
          </button>

        </div>

        <div className="space-y-3">

          {projects.map((project) => (

            <div
              key={project.id}
              className="border rounded-lg p-3 flex justify-between items-center"
            >

              <div>

                <h3 className="font-medium">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {project.category}
                </p>

              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  project.required
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {project.required ? "Required" : "Optional"}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}