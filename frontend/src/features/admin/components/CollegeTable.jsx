import CollegeStatusBadge from "./CollegeStatusBadge";
import CollegeActionButtons from "./CollegeActionButtons";
import { useNavigate } from "react-router-dom";

export default function CollegeTable({ colleges, darkMode = false, refreshColleges }) {
  const navigate = useNavigate();
  return (
    <div className={`rounded-lg shadow mt-6 overflow-x-auto transition ${darkMode ? "bg-slate-950 shadow-black/30 border border-slate-700" : "bg-white"}`}>
      <table className="w-full">
        <thead className={`${darkMode ? "bg-slate-900" : "bg-gray-100"}`}>
          <tr>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>College</th>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>Location</th>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>Departments</th>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>Students</th>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>Status</th>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            colleges.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className={`text-center py-10 transition ${darkMode ? "text-slate-400" : "text-gray-500"}`}
                >
                  No colleges found
                </td>
              </tr>
            )
          }
          {colleges?.map((college) => (
            <tr
              key={college.collegeId}
              className={`border-b transition ${darkMode ? "border-slate-700 hover:bg-slate-950" : "border-gray-200 hover:bg-slate-50"}`}
            >
              <td className={`py-5 px-4 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                <button
                  onClick={() =>
                    navigate(
                      `/admin/colleges/${college.collegeId}`
                    )
                  }
                  className={`font-medium hover:underline cursor-pointer transition ${darkMode ? "text-sky-400" : "text-blue-600"}`}
                >
                  {college.name}
                </button>
              </td>
              <td className={`p-3 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                {college.location}
              </td>
              <td className={`p-3 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                <div className="flex gap-2 flex-wrap">
                  {college.departments
                    .slice(0, 3)
                    .map((dept, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded transition ${darkMode ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}
                      >
                        {dept}
                      </span>
                    ))}
                  {
                    college.departments.length > 3 && (
                      <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
                        +{college.departments.length - 3} more
                      </span>
                    )
                  }
                </div>
              </td>
              <td className={`p-3 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                {college.studentStrength}
              </td>
              <td className="p-3">
                <CollegeStatusBadge
                  status={college.status}
                />
              </td>
              <td className="p-3">
                <CollegeActionButtons
                  status={college.status}
                  collegeName={college.name}
                  collegeId={college.collegeId}
                  refreshColleges={refreshColleges}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}