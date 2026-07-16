import StatusBadge from "../common/StatusBadge"
import { getInitials, getCgpaColor, formatCgpa } from "../../utils/studentHelpers"

const StudentCard = ({ student, onView, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
          {getInitials(student.name)}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{student.name}</h3>
          <p className="text-xs text-gray-400">{student.enrollmentNo}</p>
        </div>
      </div>
      <StatusBadge status={student.placementStatus} />
    </div>
    <div className="space-y-1.5 mb-4">
      <p className="text-xs text-gray-500">📚 {student.department}</p>
      <p className="text-xs text-gray-500">🎓 {student.course} • Sem {student.semester} • {student.batch}</p>
      <p className={`text-xs font-semibold ${getCgpaColor(student.cgpa)}`}>CGPA: {formatCgpa(student.cgpa)}</p>
    </div>
    <div className="flex gap-2">
      <button onClick={() => onView(student)} className="flex-1 text-xs text-blue-600 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-50 cursor-pointer">View</button>
      <button onClick={() => onEdit(student)} className="flex-1 text-xs text-amber-600 border border-amber-200 rounded-lg py-1.5 hover:bg-amber-50 cursor-pointer">Edit</button>
      <button onClick={() => onDelete(student)} className="flex-1 text-xs text-red-500 border border-red-200 rounded-lg py-1.5 hover:bg-red-50 cursor-pointer">Delete</button>
    </div>
  </div>
)

export default StudentCard