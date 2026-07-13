export default function StudentReadinessTab({ data }) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      <div className="p-5 border-b">

        <h2 className="text-xl font-semibold">
          Student Readiness
        </h2>

        <p className="text-gray-500 mt-1">
          Students eligible for recruitment.
        </p>

      </div>

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="text-left p-4">Student</th>

            <th className="text-left p-4">Track</th>

            <th className="text-center p-4">Score</th>

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

              <td className="p-4">
                {student.track}
              </td>

              <td className="p-4 text-center font-semibold">
                {student.score}%
              </td>

              <td className="p-4 text-center">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    student.status === "Eligible"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
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