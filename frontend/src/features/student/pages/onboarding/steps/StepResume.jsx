const StepResume = ({ resumeUrl, error, onChange }) => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-700">Add your resume</h3>
        <p className="text-xs text-slate-400 mt-1">
          The current student-profile API stores a resume URL. You can add or replace the link now and upload through the storage flow when that backend capability is available.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Resume URL</label>
        <input
          type="url"
          value={resumeUrl}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/resume.pdf"
          className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-white outline-none transition ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
          autoComplete="url"
        />
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>

      {resumeUrl ? (
        <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
          <p className="text-xs font-semibold text-green-700">Resume link ready</p>
          <p className="text-xs text-green-600 mt-1 break-all">{resumeUrl}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-500">You can leave this blank and add your resume later from your profile.</p>
        </div>
      )}
    </div>
  );
};

export default StepResume;
