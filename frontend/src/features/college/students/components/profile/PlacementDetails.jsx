import StatusBadge from "../common/StatusBadge"

const PlacementDetails = ({ student }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">Placement Details</h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400">Status</p>
        <StatusBadge status={student.placementStatus} />
      </div>
      <div className="flex justify-between">
        <p className="text-xs text-gray-400">Placed At</p>
        <p className="text-sm font-medium text-gray-700">{student.placedAt || "—"}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-xs text-gray-400">Package</p>
        <p className="text-sm font-medium text-gray-700">{student.package || "—"}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-xs text-gray-400">Resume</p>
        <p className="text-sm font-medium text-gray-700">{student.resumeStatus}</p>
      </div>
    </div>
  </div>
)

export default PlacementDetails