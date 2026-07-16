import { useState } from "react";
import { validateSubmission } from "../../validations/assignmentValidation";
import UploadAssignment from "./UploadAssignment";
import ErrorState from "../common/ErrorState";
import { CheckCircle2, Upload, Loader2 } from "lucide-react";

const AssignmentSubmissionForm = ({
  assignment,
  onSubmit,
  onCancel,
  loading = false,
  submissionError = "",
  submissionMessage = "",
}) => {
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateSubmission({
      notes,
      file,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit?.({ notes, file });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-7 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
              Assignment Submission
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              Submit Assignment
            </h2>

            {assignment?.title && (
              <p className="mt-1 text-sm text-gray-500">
                {assignment.title}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-6 p-7">

        {submissionError && (
          <ErrorState message={submissionError} />
        )}

        {submissionMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            {submissionMessage}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Submission Notes
            <span className="text-red-500"> *</span>
          </label>

          <textarea
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your submission, implementation details, approach, or notes for the evaluator..."
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
              errors.notes
                ? "border-red-300"
                : "border-gray-200"
            }`}
          />

          {errors.notes && (
            <p className="mt-2 text-xs text-red-500">
              {errors.notes}
            </p>
          )}
        </div>

        {/* Upload */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Upload File
            <span className="text-red-500"> *</span>
          </label>

          <UploadAssignment
            file={file}
            onFileChange={setFile}
            error={errors.file}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Submit Assignment
              </>
            )}
          </button>

        </div>
      </div>
    </form>
  );
};

export default AssignmentSubmissionForm;