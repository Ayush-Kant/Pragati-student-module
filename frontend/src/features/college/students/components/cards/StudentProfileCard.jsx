import StatusBadge from "../common/StatusBadge"
import { getInitials, getCgpaColor, formatCgpa, getResumeColor } from "../../utils/studentHelpers"

const StudentProfileCard = ({ student, darkMode }) => (
  <div className={`rounded-2xl border p-6 ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34]' : 'bg-orange-100 text-orange-700'}`}>
        {getInitials(student.name)}
      </div>
      <div>
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{student.name}</h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{student.enrollmentNo}</p>
        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{student.email}</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <StatusBadge status={student.placementStatus} darkMode={darkMode} />
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${darkMode ? getResumeColor(student.resumeStatus).replace('bg-emerald-100', 'bg-[#00bea3]/20').replace('text-emerald-700', 'text-[#00bea3]').replace('bg-gray-100', 'bg-[#3D3D3D]').replace('text-gray-500', 'text-gray-400') : getResumeColor(student.resumeStatus)}`}>
        Resume: {student.resumeStatus}
      </span>
      <span className={`text-xs font-bold ${getCgpaColor(student.cgpa)}`}>
        CGPA: {formatCgpa(student.cgpa)}
      </span>
    </div>
  </div>
)

export default StudentProfileCard