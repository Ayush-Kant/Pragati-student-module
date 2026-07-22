import StudentRow from "./StudentRow"
import EmptyState from "../common/EmptyState"

const HEADERS = ["Student", "Department", "Course", "Batch", "Semester", "CGPA", "Status", "Actions"]

const StudentTable = ({ students = [], onView, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            {HEADERS.map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={HEADERS.length}>
                <EmptyState />
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
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)

export default StudentTable