import StudentProfileCard from "../cards/StudentProfileCard"
import AcademicDetails from "./AcademicDetails"
import PlacementDetails from "./PlacementDetails"
import SkillsSection from "./SkillsSection"

const StudentProfilePreview = ({ student, onClose, onEdit }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
    <div className="bg-gray-50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white rounded-t-2xl">
        <h2 className="text-base font-bold text-gray-800">Student Profile</h2>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-sm text-amber-600 border border-amber-200 rounded-xl px-4 py-1.5 hover:bg-amber-50 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 border border-gray-200 rounded-xl px-4 py-1.5 hover:bg-gray-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <StudentProfileCard student={student} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AcademicDetails student={student} />
          <PlacementDetails student={student} />
        </div>
        <SkillsSection student={student} />
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">📧 {student.email}</p>
            <p className="text-sm text-gray-600">📱 {student.phone}</p>
            <p className="text-sm text-gray-600">📍 {student.address || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default StudentProfilePreview    