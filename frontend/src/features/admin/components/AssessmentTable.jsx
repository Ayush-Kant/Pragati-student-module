import { useNavigate } from "react-router-dom";

import AssessmentTypeBadge from "./AssessmentTypeBadge";
import AssessmentStatusBadge from "./AssessmentStatusBadge";

const AssessmentTable = ({
  assessments,
  onEdit,
  onArchive,
  onPublish,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* ========================= */}
          {/* TABLE HEADER */}
          {/* ========================= */}

          <thead className="bg-gray-100 dark:bg-slate-800">
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-200">
                Assessment Title
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-200">
                Type
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-200">
                Difficulty
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-200">
                Duration
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-200">
                Questions
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-200">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-slate-200">
                Actions
              </th>
            </tr>
          </thead>

          {/* ========================= */}
          {/* TABLE BODY */}
          {/* ========================= */}

          <tbody>
            {assessments.length > 0 ? (
              assessments.map((assessment) => (
                <tr
                  key={assessment.id}
                  className="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  {/* Title */}

                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-100">
                    {assessment.title}
                  </td>

                  {/* Type */}

                  <td className="px-6 py-4">
                    <AssessmentTypeBadge
                      type={assessment.type}
                    />
                  </td>

                  {/* Difficulty */}

                  <td className="px-6 py-4 text-gray-700 dark:text-slate-300">
                    {assessment.difficulty}
                  </td>

                  {/* Duration */}

                  <td className="px-6 py-4 text-gray-700 dark:text-slate-300">
                    {assessment.timeLimitMinutes} min
                  </td>

                  {/* Questions */}

                  <td className="px-6 py-4 text-gray-700 dark:text-slate-300">
                    {assessment.questionsCount}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">
                    <AssessmentStatusBadge
                      status={assessment.status}
                    />
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-center gap-2">

                      {/* View */}

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/assessments/${assessment.id}`
                          )
                        }
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        View
                      </button>

                      {/* Edit */}

                      <button
                        onClick={() =>
                          onEdit(assessment)
                        }
                        className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                      >
                        Edit
                      </button>

                      {/* Publish */}

                      <button
                        onClick={() =>
                          onPublish(assessment)
                        }
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                      >
                        Publish
                      </button>

                      {/* Archive */}

                      <button
                        onClick={() =>
                          onArchive(assessment)
                        }
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
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
                  colSpan={7}
                  className="py-12 text-center text-gray-500 dark:text-slate-400"
                >
                  No assessments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssessmentTable;