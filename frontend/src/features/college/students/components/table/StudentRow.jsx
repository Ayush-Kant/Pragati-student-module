import StatusBadge from "../common/StatusBadge"
import { getInitials, getCgpaColor, formatCgpa } from "../../utils/studentHelpers"

const StudentRow = ({ student, onView, onEdit, onDelete }) => (
  <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
    <td className="py-3 px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
          {getInitials(student.name)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{student.name}</p>
          <p className="text-xs text-gray-400">{student.enrollmentNo}</p>
        </div>
      </div>
    </td>
    <td className="py-3 px-4 text-sm text-gray-600">{student.department}</td>
    <td className="py-3 px-4 text-sm text-gray-600">{student.course}</td>
    <td className="py-3 px-4 text-sm text-gray-600">{student.batch}</td>
    <td className="py-3 px-4 text-sm text-gray-600">Sem {student.semester}</td>
    <td className={`py-3 px-4 text-sm font-semibold ${getCgpaColor(student.cgpa)}`}>
      {formatCgpa(student.cgpa)}
    </td>
    <td className="py-3 px-4">
      <StatusBadge status={student.placementStatus} />
    </td>
    <td className="py-3 px-4">
      <div className="flex gap-2">
        <button onClick={() => onView(student)} className="text-xs text-blue-600 hover:underline cursor-pointer">View</button>
        <button onClick={() => onEdit(student)} className="text-xs text-amber-600 hover:underline cursor-pointer">Edit</button>
        <button onClick={() => onDelete(student)} className="text-xs text-red-500 hover:underline cursor-pointer">Delete</button>
      </div>
    </td>
  </tr>
)

export default StudentRow