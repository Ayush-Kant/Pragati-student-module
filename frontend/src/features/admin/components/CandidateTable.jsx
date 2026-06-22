import { useMemo, useState } from "react";

import { moveCandidate, PIPELINE_STAGES } from "../services/adminService";

const ITEMS_PER_PAGE = 5;

const normalizeStage = (stage) => {
  switch (stage) {
    case "applied":
      return "application";

    case "screened":
      return "screening";

    case "shortlisted":
      return "shortlist";

    case "selected":
      return "selection";

    default:
      return stage;
  }
};
const stageLabels = {
  application: "Applied",
  screening: "Screened",
  training: "Training",
  shortlist: "Shortlisted",
  interviews: "Interviews",
  selection: "Selected",
};

const CandidateTable = ({ driveId, candidates = [], refreshCandidates }) => {
  const [stageFilter, setStageFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCandidates = useMemo(() => {
    if (stageFilter === "all") {
      return candidates;
    }

    return candidates.filter(
      (candidate) => normalizeStage(candidate.currentStage) === stageFilter,
    );
  }, [candidates, stageFilter]);

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleMoveStage = async (studentId, studentName, targetStage) => {
    const confirmed = window.confirm(
      `Move ${studentName} to ${stageLabels[targetStage]}?`,
    );

    if (!confirmed) return;

    try {
      await moveCandidate(driveId, {
        studentId,
        targetStage,
      });

      alert("Candidate moved successfully");

      await refreshCandidates();
    } catch (error) {
      console.error(error);
      alert("Failed to move candidate");
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Candidates</h2>

        <select
          value={stageFilter}
          onChange={(e) => {
            setStageFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded border px-3 py-2"
        >
          <option value="all">All Stages</option>

          {PIPELINE_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stageLabels[stage]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">College</th>
              <th className="p-3 text-left">Current Stage</th>
              <th className="p-3 text-left">Assessment Score</th>
              <th className="p-3 text-left">Training Completion</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCandidates.map((candidate) => {
              const completion = parseInt(candidate.trainingCompletion) || 0;

              return (
                <tr key={candidate.studentId} className="border-b">
                  <td className="p-3">{candidate.name}</td>

                  <td className="p-3">{candidate.college}</td>

                  <td className="p-3">
                    {stageLabels[normalizeStage(candidate.currentStage)]}
                  </td>

                  <td className="p-3">{candidate.assessmentScore}</td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded bg-gray-200">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${completion}%`,
                          }}
                        />
                      </div>

                      <span className="text-sm">{completion}%</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (!e.target.value) return;

                        handleMoveStage(
                          candidate.studentId,
                          candidate.name,
                          e.target.value,
                        );

                        e.target.value = "";
                      }}
                      className="rounded border px-2 py-1"
                    >
                      <option value="">Move Stage</option>

                      {PIPELINE_STAGES.map((stage) => (
                        <option key={stage} value={stage}>
                          {stageLabels[stage]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <div className="py-6 text-center text-gray-500">
          No candidates found.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateTable;
