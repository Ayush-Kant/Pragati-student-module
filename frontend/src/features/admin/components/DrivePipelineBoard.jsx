import { PIPELINE_STAGES } from "../services/adminService";

const stageLabels = {
  application: "Applied",
  screening: "Screened",
  training: "Training",
  shortlist: "Shortlisted",
  interviews: "Interviews",
  selection: "Selected",
};

const DrivePipelineBoard = ({ pipeline, currentStage, status }) => {
  if (!pipeline) return null;

  const currentIndex = PIPELINE_STAGES.indexOf(currentStage);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      {/* Frozen Banner */}
      {status === "frozen" && (
        <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm font-medium text-yellow-800">
          🔒 Pipeline Frozen
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold">Recruitment Pipeline</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {PIPELINE_STAGES.map((stage, index) => {
          const isCurrent = stage === currentStage;

          const isCompleted = index < currentIndex;

          const count =
            pipeline[
              stage === "application"
                ? "applied"
                : stage === "screening"
                  ? "screened"
                  : stage === "shortlist"
                    ? "shortlisted"
                    : stage === "selection"
                      ? "selected"
                      : stage
            ] || 0;

          return (
            <div
              key={stage}
              className={`
                rounded-lg border p-4 transition
                ${isCurrent ? "border-l-4 border-l-teal-500" : ""}
                ${isCompleted ? "opacity-60" : ""}
              `}
            >
              <div className="text-sm font-medium text-gray-600">
                {stageLabels[stage]}
              </div>

              <div className="mt-2 text-2xl font-bold">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DrivePipelineBoard;
