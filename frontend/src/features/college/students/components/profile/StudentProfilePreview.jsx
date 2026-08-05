import StudentProfileCard from "../cards/StudentProfileCard"
import AcademicDetails from "./AcademicDetails"
import PlacementDetails from "./PlacementDetails"
import SkillsSection from "./SkillsSection"

const StudentProfilePreview = ({ student, onClose, onEdit, darkMode }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
    <div className={`rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl ${darkMode ? 'bg-[#1A1A1A] border border-[#3D3D3D]' : 'bg-gray-50'}`}>
      <div className={`flex items-center justify-between p-5 border-b rounded-t-2xl ${darkMode ? 'border-[#3D3D3D] bg-[#2D2D2D]' : 'border-gray-200 bg-white'}`}>
        <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Student Profile</h2>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className={`text-sm rounded-xl px-4 py-1.5 cursor-pointer ${darkMode ? 'text-[#ff6d34] border border-[#ff6d34]/30 hover:bg-[#ff6d34]/10' : 'text-amber-600 border border-amber-200 hover:bg-amber-50'}`}
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className={`text-sm rounded-xl px-4 py-1.5 cursor-pointer ${darkMode ? 'text-gray-400 border border-[#3D3D3D] hover:bg-[#3D3D3D]' : 'text-gray-500 border border-gray-200 hover:bg-gray-100'}`}
          >
            Close
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <StudentProfileCard student={student} darkMode={darkMode} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AcademicDetails student={student} darkMode={darkMode} />
          <PlacementDetails student={student} darkMode={darkMode} />
        </div>
        <SkillsSection student={student} darkMode={darkMode} />
        <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Contact Information</h3>
          <div className="space-y-2">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>📧 {student.email}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>📱 {student.phone}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>📍 {student.address || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default StudentProfilePreview    