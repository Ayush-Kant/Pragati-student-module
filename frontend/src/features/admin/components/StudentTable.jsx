
import StudentStatusBadge from "./StudentStatusBadge";
import StudentActionButtons from "./StudentActionButtons";
import { useNavigate } from "react-router-dom";


const StudentTable = ({ students, darkMode = false }) => {
  const navigate = useNavigate();

  if (!students?.length) {
    return (
      <div className="text-center py-6">
        No students found
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow mt-6 overflow-x-auto transition ${darkMode ? "bg-slate-950 shadow-black/30 border border-slate-700" : "bg-white"}`}>
      <table className="w-full">
        <thead className={`${darkMode ? "bg-slate-900" : "bg-gray-100"}`}>
          <tr>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>Name</th>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>Email</th>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>College</th>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>GPA</th>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>Status</th>
            <th className={`p-3 text-left ${darkMode ? "text-slate-300" : "text-slate-900"}`}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className={`border-b transition ${darkMode ? "border-slate-700 hover:bg-slate-950" : "border-gray-200 hover:bg-slate-50"}`}
            >
              <td className={`py-5 px-4`}>
                <button
                  onClick={() => navigate(`/admin/students/${student.id}`)}
                  className={`font-medium hover:underline cursor-pointer ${darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                >
                  {student.name}
                </button>
              </td>

              <td className={`p-3 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                {student.email}
              </td>

              <td className={`p-3 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                {student.college?.name}
              </td>

              <td className={`p-3 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                {student.gpa}
              </td>

              <td className={`p-3 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                <StudentStatusBadge
                  status={student.status}
                />
              </td>
              <td className={`p-3 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                <StudentActionButtons student={student} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default StudentTable;