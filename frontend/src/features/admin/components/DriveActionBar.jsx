import {
  advanceDrive,
  freezeDrive,
  unfreezeDrive,
  PIPELINE_STAGES,
} from "../services/adminService";

const DriveActionBar = ({
  drive,
  refreshDrive,
  refreshCandidates,
  onOpenShortlist,
}) => {
  if (!drive) return null;

  const currentIndex = PIPELINE_STAGES.indexOf(drive.currentStage);

  const nextStage =
    currentIndex >= 0 && currentIndex < PIPELINE_STAGES.length - 1
      ? PIPELINE_STAGES[currentIndex + 1]
      : null;

  const handleAdvanceStage = async () => {
    const confirmed = window.confirm(
      `Advance this drive from ${drive.currentStage} to ${nextStage}? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await advanceDrive(drive.id);

      alert("Stage advanced successfully");

      await refreshDrive();
      await refreshCandidates();
    } catch (error) {
      console.error(error);
      alert("Failed to advance stage");
    }
  };

  const handleFreeze = async () => {
    const confirmed = window.confirm(
      "Freeze the pipeline? No further changes will be allowed until unfrozen.",
    );

    if (!confirmed) return;

    try {
      await freezeDrive(drive.id);

      alert("Pipeline frozen successfully");

      await refreshDrive();
    } catch (error) {
      console.error(error);
      alert("Failed to freeze pipeline");
    }
  };

  const handleUnfreeze = async () => {
    const confirmed = window.confirm(
      "Unfreeze the pipeline? Changes will be permitted again.",
    );

    if (!confirmed) return;

    try {
      await unfreezeDrive(drive.id);

      alert("Pipeline unfrozen successfully");

      await refreshDrive();
    } catch (error) {
      console.error(error);
      alert("Failed to unfreeze pipeline");
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-3">
        {/* Advance Stage */}
        <button
          onClick={handleAdvanceStage}
          disabled={
            drive.status === "frozen" || drive.currentStage === "selection"
          }
          className="rounded bg-teal-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Advance Stage
        </button>

        {/* Freeze */}
        {drive.status !== "frozen" && (
          <button
            onClick={handleFreeze}
            className="rounded bg-orange-500 px-4 py-2 text-white"
          >
            Freeze Pipeline
          </button>
        )}

        {/* Unfreeze */}
        {drive.status === "frozen" && (
          <button
            onClick={handleUnfreeze}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Unfreeze Pipeline
          </button>
        )}

        {/* Auto Shortlist */}
        {drive.currentStage === "shortlist" && (
          <button
            onClick={onOpenShortlist}
            className="rounded bg-purple-600 px-4 py-2 text-white"
          >
            Auto Shortlist
          </button>
        )}
      </div>
    </div>
  );
};

export default DriveActionBar;
