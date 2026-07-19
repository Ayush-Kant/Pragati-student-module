import { useNavigate } from "react-router-dom";
import DisputeStatusBadge from "./DisputeStatusBadge";
import DisputePriorityBadge from "./DisputePriorityBadge";
import DisputeTypeBadge from "./DisputeTypeBadge";
import { useOutletContext } from "react-router-dom";

// const { darkMode } = useOutletContext();

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 8 }).map((_, index) => (
      <td key={index} className="px-4 py-4">
        <div className="h-5 w-full rounded bg-gray-200 animate-pulse"></div>
      </td>
    ))}
  </tr>
);

const DisputeTable = ({
  disputes,
  loading,
  error,
}) => {
  const navigate = useNavigate();
    const { darkMode } = useOutletContext();
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
        {error}
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className={`${darkMode ? 'bg-gray-600' : 'bg-gray-100'} text-gray-700`}>
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Filed By</th>
              <th className="px-4 py-3 text-left">Against</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Filed Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))}

            {!loading && disputes.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10">
                    <div className="text-center">
                    <h3 className="text-lg font-semibold">
                        No disputes found
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Try changing your search or filters.
                    </p>
                    </div>
                </td>
                </tr>
            )}

            {!loading &&
              disputes.map((dispute) => (
                <tr
                  key={dispute.id}
                  onClick={() =>
                    navigate(`/admin/disputes/${dispute.id}`)
                  }
                  className="border-t hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium">
                    {dispute.id}
                  </td>

                  <td className="px-4 py-3">
                    {dispute.filedBy?.name || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {dispute.against?.name || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <DisputeTypeBadge
                      type={dispute.type}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <DisputeStatusBadge
                      status={dispute.status}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <DisputePriorityBadge
                      priority={dispute.priority}
                    />
                  </td>

                  <td className="px-4 py-3">
                    {dispute.createdAt
                      ? new Date(dispute.createdAt).toLocaleString()
                      : "-"}
                  </td>

                  <td
                    className="px-4 py-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/disputes/${dispute.id}`
                        )
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisputeTable;