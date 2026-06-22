import { useState } from "react";
import { toast } from "react-hot-toast";

import { shortlistCandidates } from "../services/adminService";

const ShortlistModal = ({ open, onClose, driveId, refreshCandidates }) => {
  const [minAssessmentScore, setMinAssessmentScore] = useState("");

  const [minTrainingCompletion, setMinTrainingCompletion] = useState("");

  const [topN, setTopN] = useState("");

  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setMinAssessmentScore("");
    setMinTrainingCompletion("");
    setTopN("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const score = Number(minAssessmentScore);
    const completion = Number(minTrainingCompletion);
    const topCandidates = Number(topN);

    if (minAssessmentScore !== "" && (score < 0 || score > 100)) {
      toast.error("Assessment score must be between 0 and 100");
      return;
    }

    if (minTrainingCompletion !== "" && (completion < 0 || completion > 100)) {
      toast.error("Training completion must be between 0 and 100");
      return;
    }

    if (!topCandidates || topCandidates <= 0) {
      toast.error("Top N Candidates must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);

      const response = await shortlistCandidates(driveId, {
        minAssessmentScore: minAssessmentScore === "" ? 0 : score,

        minTrainingCompletion: minTrainingCompletion === "" ? 0 : completion,
        topN: topCandidates,
      });

      toast.success(`${response.shortlistedCount} candidates shortlisted`);

      await refreshCandidates();

      handleClose();
    } catch (error) {
      console.error(error);

      toast.error("Failed to shortlist candidates");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Auto Shortlist</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Min Assessment Score
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={minAssessmentScore}
              onChange={(e) => setMinAssessmentScore(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Min Training Completion %
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={minTrainingCompletion}
              onChange={(e) => setMinTrainingCompletion(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">
              Top N Candidates
            </label>

            <input
              type="number"
              min="1"
              value={topN}
              onChange={(e) => setTopN(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded border px-4 py-2 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-purple-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {submitting ? "Shortlisting..." : "Apply Shortlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShortlistModal;
