import StatusBadge from "../common/StatusBadge"
import { getInitials, getCgpaColor, formatCgpa } from "../../utils/studentHelpers"

const StudentCard = ({ student, onView, onEdit, onDelete, darkMode }) => (
  <div className={`rounded-2xl border p-5 hover:shadow-md transition-shadow ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34]' : 'bg-orange-100 text-orange-700'}`}>
          {getInitials(student.name)}
        </div>
        <div>
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{student.name}</h3>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{student.enrollmentNo}</p>
        </div>
      </div>
      <StatusBadge status={student.placementStatus} darkMode={darkMode} />
    </div>
    <div className="space-y-1.5 mb-4">
      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>📚 {student.department}</p>
      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>🎓 {student.course} • Sem {student.semester} • {student.batch}</p>
      <p className={`text-xs font-semibold ${getCgpaColor(student.cgpa)}`}>CGPA: {formatCgpa(student.cgpa)}</p>
    </div>
    <div className="flex gap-2">
      <button onClick={() => onView(student)} className={`flex-1 text-xs border rounded-lg py-1.5 cursor-pointer ${darkMode ? 'text-[#00bea3] border-[#00bea3]/30 hover:bg-[#00bea3]/10' : 'text-blue-600 border-blue-200 hover:bg-blue-50'}`}>View</button>
      <button onClick={() => onEdit(student)} className={`flex-1 text-xs border rounded-lg py-1.5 cursor-pointer ${darkMode ? 'text-[#ff6d34] border-[#ff6d34]/30 hover:bg-[#ff6d34]/10' : 'text-amber-600 border-amber-200 hover:bg-amber-50'}`}>Edit</button>
      <button onClick={() => onDelete(student)} className={`flex-1 text-xs border rounded-lg py-1.5 cursor-pointer ${darkMode ? 'text-red-400 border-red-500/30 hover:bg-red-500/10' : 'text-red-500 border-red-200 hover:bg-red-50'}`}>Delete</button>
    </div>
  </div>
)

export default StudentCard