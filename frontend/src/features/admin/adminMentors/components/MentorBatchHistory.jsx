const MentorBatchHistory = ({ batches }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        Batch History
      </h2>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-3">
              Drive ID
            </th>
            <th className="text-left p-3">
              Batch ID
            </th>
            <th className="text-left p-3">
              Title
            </th>
            <th className="text-left p-3">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {batches.map((batch) => (
            <tr key={batch.batchId}>
              <td className="p-3">
                {batch.driveId}
              </td>
              <td className="p-3">
                {batch.batchId}
              </td>
              <td className="p-3">
                {batch.title}
              </td>
              <td className="p-3">
                {batch.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MentorBatchHistory;