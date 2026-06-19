import DriveStatusBadge from "./DriveStatusBadge";
import DriveStageBadge from "./DriveStageBadge";

export default function DriveTable({
  drives,
  onDelete,
  onFreeze,
  onUnfreeze,
}) {

  return (
    <div className="bg-white shadow rounded overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Company</th>
            <th className="p-3">Candidates</th>
            <th className="p-3">Status</th>
            <th className="p-3">Stage</th>
            <th className="p-3">Actions</th>
          </tr>

        </thead>

        <tbody>

          {drives.map((drive) => (

            <tr key={drive.id} className="border-t">

              <td className="p-3">{drive.title}</td>

              <td className="p-3">
                {drive.company.name}
              </td>

              <td className="p-3">
                {drive.candidates}
              </td>

              <td className="p-3">
                <DriveStatusBadge status={drive.status}/>
              </td>

              <td className="p-3">
                <DriveStageBadge stage={drive.currentStage}/>
              </td>

              <td className="p-3 flex gap-2">

                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  View
                </button>

                {
                  drive.status === "frozen"
                  ? (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => onUnfreeze(drive.id)}
                    >
                      Unfreeze
                    </button>
                  )
                  : (
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => onFreeze(drive.id)}
                    >
                      Freeze
                    </button>
                  )
                }

                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => onDelete(drive.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}