import AssessmentTypeBadge from "./AssessmentTypeBadge";
import AssessmentStatusBadge from "./AssessmentStatusBadge";

const AssessmentTable = ({
  assessments,
  onEdit,
  onArchive,
  onPublish,
}) => {
  return (
    <div className="mt-6 overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-4 text-left">
              Assessment Title
            </th>

            <th className="p-4 text-left">
              Type
            </th>

            <th className="p-4 text-left">
              Difficulty
            </th>

            <th className="p-4 text-left">
              Duration
            </th>

            <th className="p-4 text-left">
              Questions
            </th>

            <th className="p-4 text-left">
              Status
            </th>

            <th className="p-4 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {assessments.length > 0 ? (
            assessments.map((assessment) => (
              <tr
                key={assessment.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">
                  {assessment.title}
                </td>

                <td className="p-4">
                  <AssessmentTypeBadge
                    type={assessment.type}
                  />
                </td>

                <td className="p-4">
                  {assessment.difficulty}
                </td>

                <td className="p-4">
                  {
                    assessment.timeLimitMinutes
                  }{" "}
                  min
                </td>

                <td className="p-4">
                  {
                    assessment.questionsCount
                  }
                </td>

                <td className="p-4">
                  <AssessmentStatusBadge
                    status={
                      assessment.status
                    }
                  />
                </td>

                <td className="p-4">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        onEdit(
                          assessment
                        )
                      }
                      className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                    onClick={() =>
                    onPublish(assessment)
                    }
                    className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                    Publish
                    </button>

                    <button
                    onClick={() =>
                    onArchive(assessment)
                    }
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                    Archive
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="p-8 text-center text-gray-500"
              >
                No assessments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentTable;