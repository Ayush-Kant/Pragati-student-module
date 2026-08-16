import { useState } from "react";
import { validateSubmission } from "../../utils/assignmentValidation";
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
  darkMode = false,
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
      className={`rounded-3xl border shadow-sm overflow-hidden transition-colors ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between border-b px-7 py-5 transition-colors ${darkMode ? "border-slate-700" : "border-gray-100"}`}>
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
            <Upload className="h-6 w-6 text-blue-600" />
          </div>

          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
              Assignment Submission
            </p>

            <h2 className={`mt-1 text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Submit Assignment
            </h2>

            {assignment?.title && (
              <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                {assignment.title}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-6 p-7">

        {submissionError && (
          <ErrorState message={submissionError} darkMode={darkMode} />
        )}

        {submissionMessage && (
          <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
            darkMode
              ? "border-emerald-800 bg-emerald-900/20 text-emerald-400"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}>
            <CheckCircle2 className={`h-5 w-5 ${darkMode ? "text-emerald-500" : "text-emerald-500"}`} />
            {submissionMessage}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className={`mb-2 block text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
            Submission Notes
            <span className="text-red-500"> *</span>
          </label>

          <textarea
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your submission, implementation details, approach, or notes for the evaluator..."
            className={`w-full rounded-2xl border px-4 py-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 ${
              errors.notes
                ? darkMode
                  ? "border-red-700 bg-slate-800 text-slate-200 focus:ring-red-900/30"
                  : "border-red-300 bg-white text-gray-700 focus:ring-blue-100"
                : darkMode
                ? "border-slate-600 bg-slate-800 text-slate-200 placeholder:text-slate-500 focus:ring-blue-900/30"
                : "border-gray-200 bg-white text-gray-700 placeholder:text-gray-400 focus:ring-blue-100"
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
          <label className={`mb-2 block text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
            Upload File
            <span className="text-red-500"> *</span>
          </label>

          <UploadAssignment
            file={file}
            onFileChange={setFile}
            error={errors.file}
            darkMode={darkMode}
          />
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 border-t pt-5 ${darkMode ? "border-slate-700" : "border-gray-100"}`}>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                darkMode
                  ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
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