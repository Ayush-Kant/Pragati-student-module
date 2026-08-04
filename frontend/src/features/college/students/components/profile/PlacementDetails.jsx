import StatusBadge from "../common/StatusBadge"

const PlacementDetails = ({ student, darkMode }) => (
  <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
    <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Placement Details</h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Status</p>
        <StatusBadge status={student.placementStatus} darkMode={darkMode} />
      </div>
      <div className="flex justify-between">
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Placed At</p>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{student.placedAt || "—"}</p>
      </div>
      <div className="flex justify-between">
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Package</p>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{student.package || "—"}</p>
      </div>
      <div className="flex justify-between">
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Resume</p>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{student.resumeStatus}</p>
      </div>
    </div>
  </div>
)

export default PlacementDetails