import { useState } from "react";

export default function HiringContentTab({ data }) {
  const [courses, setCourses] = useState(data.courses);
  const [projects, setProjects] = useState(data.projects);

  const toggleCourse = (id) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id
          ? { ...course, required: !course.required }
          : course
      )
    );
  };

  const toggleProject = (id) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, required: !project.required }
          : project
      )
    );
  };

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

        </div>

        <div className="space-y-3">

          {courses.map((course) => (

            <div
              key={course.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >

              <div>

                <h3 className="font-medium">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {course.category}
                </p>

              </div>

             <label className="cursor-pointer">

  <input
    type="checkbox"
    checked={course.required}
    onChange={() => toggleCourse(course.id)}
    className="hidden"
  />

  <div
    className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
      course.required ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <div
      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
        course.required ? "left-6" : "left-1"
      }`}
    />
  </div>

</label>

            </div>

          ))}

        </div>

      </div>

      {/* Projects */}

      <div className="border rounded-xl bg-white p-5">

        <div className="flex justify-between items-center mb-5">

          <div>

            <h2 className="text-lg font-semibold">
              Practical Projects
            </h2>

            <p className="text-gray-500 text-sm">
              Portfolio projects for hiring.
            </p>

          </div>

        </div>

        <div className="space-y-3">

          {projects.map((project) => (

            <div
              key={project.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >

              <div>

                <h3 className="font-medium">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {project.category}
                </p>

              </div>
              <label className="cursor-pointer">

  <input
    type="checkbox"
    checked={project.required}
    onChange={() => toggleProject(project.id)}
    className="hidden"
  />

  <div
    className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
      project.required ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <div
      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
        project.required ? "left-6" : "left-1"
      }`}
    />
  </div>

</label>
            </div>

          ))}

        </div>

      </div>

    </div>
  );
}