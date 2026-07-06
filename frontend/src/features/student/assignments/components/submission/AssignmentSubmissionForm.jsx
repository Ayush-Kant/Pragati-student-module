import { useState } from "react";
import { validateSubmission } from "../../validations/assignmentValidation";
import UploadAssignment from "./UploadAssignment";
import ErrorState from "../common/ErrorState";

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
    const validationErrors = validateSubmission({ notes, file });

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
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-5"
    >
      <h3 className="text-base font-bold text-gray-800">
        Submit Assignment
        {assignment?.title && (
          <span className="block text-xs font-normal text-gray-400 mt-0.5">
            {assignment.title}
          </span>
        )}
      </h3>

      {submissionError && <ErrorState message={submissionError} />}

      {submissionMessage && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl">
          ✓ {submissionMessage}
        </div>
      )}

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Submission Notes <span className="text-red-500">*</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Describe your submission, approach, or any notes for the instructor..."
          className={`text-sm text-gray-700 bg-white border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-gray-400 transition-shadow ${
            errors.notes ? "border-red-300" : "border-gray-200"
          }`}
        />
        {errors.notes && (
          <p className="text-xs text-red-500">{errors.notes}</p>
        )}
      </div>

      {/* File Upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          File Upload <span className="text-red-500">*</span>
        </label>
        <UploadAssignment file={file} onFileChange={setFile} error={errors.file} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AssignmentSubmissionForm;
