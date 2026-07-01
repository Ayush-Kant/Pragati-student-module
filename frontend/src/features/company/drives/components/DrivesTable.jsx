import { DriveRow } from './DriveRow';

export const DrivesTable = ({ drives, onView, onEdit, onViewCandidates, onChangeStage, onDelete }) => {
  return (
    <div className="responsive-table-wrap overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Drive Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Candidates</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stage</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deadline</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drives.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-12 text-gray-500 font-medium bg-white">
                No drives found
              </td>
            </tr>
          ) : (
            drives.map((drive) => (
              <DriveRow
                key={drive.id}
                drive={drive}
                onView={onView}
                onEdit={onEdit}
                onViewCandidates={onViewCandidates}
                onChangeStage={onChangeStage}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
