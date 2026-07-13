export default function ShortlistedTab({ data }) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      <div className="p-5 border-b flex justify-between items-center">

        <div>
          <h2 className="text-xl font-semibold">
            Shortlisted Candidates
          </h2>

          <p className="text-gray-500 mt-1">
            Students ready to be shared with companies.
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Publish List
        </button>

      </div>

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="text-left p-4">Student</th>

            <th className="text-center p-4">Score</th>

            <th className="text-left p-4">Remarks</th>

            <th className="text-center p-4">Status</th>

          </tr>

        </thead>

        <tbody>

          {data.map((student) => (

            <tr
              key={student.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="p-4 font-medium">
                {student.name}
              </td>

              <td className="p-4 text-center font-semibold">
                {student.score}%
              </td>

              <td className="p-4">
                {student.note}
              </td>

              <td className="p-4 text-center">

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {student.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}