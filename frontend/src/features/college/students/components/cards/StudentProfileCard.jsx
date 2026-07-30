import StatusBadge from "../common/StatusBadge"
import { getInitials, getCgpaColor, formatCgpa, getResumeColor } from "../../utils/studentHelpers"

const StudentProfileCard = ({ student }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
        {getInitials(student.name)}
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-800">{student.name}</h2>
        <p className="text-sm text-gray-400">{student.enrollmentNo}</p>
        <p className="text-sm text-gray-500">{student.email}</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <StatusBadge status={student.placementStatus} />
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getResumeColor(student.resumeStatus)}`}>
        Resume: {student.resumeStatus}
      </span>
      <span className={`text-xs font-bold ${getCgpaColor(student.cgpa)}`}>
        CGPA: {formatCgpa(student.cgpa)}
      </span>
    </div>
  </div>
)

export default StudentProfileCard