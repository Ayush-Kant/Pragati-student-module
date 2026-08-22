import StudentRow from "./StudentRow"
import EmptyState from "../common/EmptyState"

const HEADERS = ["Student", "Department", "Course", "Batch", "Semester", "CGPA", "Status", "Actions"]

const StudentTable = ({ students = [], onView, onEdit, onDelete, darkMode }) => (
  <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white border border-gray-100'}`}>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className={`text-left ${darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
            {HEADERS.map((h) => (
              <th key={h} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={HEADERS.length}>
                <EmptyState darkMode={darkMode} />
              </td>
            </tr>
          ) : (
            students.map((s) => (
              <StudentRow
                key={s.id}
                student={s}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                darkMode={darkMode}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)

export default StudentTable