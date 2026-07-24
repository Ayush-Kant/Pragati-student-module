import StatusBadge from "../common/StatusBadge"
import { getInitials, getCgpaColor, formatCgpa } from "../../utils/studentHelpers"

const StudentRow = ({ student, onView, onEdit, onDelete, darkMode }) => (
  <tr className={`border-b transition-colors ${darkMode ? 'border-[#3D3D3D] hover:bg-[#1A1A1A]' : 'border-gray-50 hover:bg-gray-50'}`}>
    <td className="py-3 px-4">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34]' : 'bg-orange-100 text-orange-700'}`}>
          {getInitials(student.name)}
        </div>
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{student.name}</p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{student.enrollmentNo}</p>
        </div>
      </div>
    </td>
    <td className={`py-3 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{student.department}</td>
    <td className={`py-3 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{student.course}</td>
    <td className={`py-3 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{student.batch}</td>
    <td className={`py-3 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sem {student.semester}</td>
    <td className={`py-3 px-4 text-sm font-semibold ${getCgpaColor(student.cgpa)}`}>
      {formatCgpa(student.cgpa)}
    </td>
    <td className="py-3 px-4">
      <StatusBadge status={student.placementStatus} darkMode={darkMode} />
    </td>
    <td className="py-3 px-4">
      <div className="flex gap-2">
        <button onClick={() => onView(student)} className={`text-xs cursor-pointer ${darkMode ? 'text-[#00bea3] hover:underline' : 'text-blue-600 hover:underline'}`}>View</button>
        <button onClick={() => onEdit(student)} className={`text-xs cursor-pointer ${darkMode ? 'text-[#ff6d34] hover:underline' : 'text-amber-600 hover:underline'}`}>Edit</button>
        <button onClick={() => onDelete(student)} className="text-xs text-red-500 hover:underline cursor-pointer">Delete</button>
      </div>
    </td>
  </tr>
)

export default StudentRow