import { MoreVertical } from "lucide-react";

export default function StudentReadinessTab({ data }) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      {/* Header */}

      <div className="p-5 border-b">

        <h2 className="text-xl font-semibold">
          Student Readiness
        </h2>

        <p className="text-gray-500 mt-1">
          Students eligible for recruitment.
        </p>

      </div>

      {/* Table */}

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="text-left px-6 py-4">
              Student
            </th>

            <th className="text-left px-6 py-4">
              Score
            </th>

            <th className="text-center px-6 py-4">
              Status
            </th>

            <th className="text-right px-6 py-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map((student) => (

            <tr
              key={student.id}
              className="border-t hover:bg-gray-50 transition"
            >

              {/* Student */}

              <td className="px-6 py-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">

                    {student.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}

                  </div>

                  <div>

                    <p className="font-semibold text-gray-900">
                      {student.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {student.track}
                    </p>

                  </div>

                </div>

              </td>

              {/* Score */}

              <td className="px-6 py-4">

                <div className="flex items-center gap-3">

                  <span className="font-semibold w-8">
                    {student.score}
                  </span>

                  <div className="w-24 h-2 bg-gray-200 rounded-full">

                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{
                        width: `${student.score}%`,
                      }}
                    />

                  </div>

                </div>

              </td>

              {/* Status */}

              <td className="px-6 py-4 text-center">

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

              {/* Actions */}

              <td className="px-6 py-4 text-right">

                <button
                  className="
                    p-2
                    rounded-lg
                    hover:bg-gray-100
                    transition
                  "
                >
                  <MoreVertical
                    size={18}
                    className="text-gray-500"
                  />
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}