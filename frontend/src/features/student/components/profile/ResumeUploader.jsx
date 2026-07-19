import { useState, useRef } from "react";

const ResumeUploader = ({ resumeFile, onUpload }) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const validateAndSet = (file) => {
    setError("");

    if (!file) return;

    // PDF only check
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    // Max 5MB check
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }

    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSet(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    validateAndSet(e.target.files[0]);
    e.target.value = "";
  };

  const handleRemove = () => {
    onUpload(null);
    setError("");
  };

  return (
    <div className="w-full">
      {/* Uploaded File Preview */}
      {resumeFile ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            {/* PDF icon */}
            <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-xs font-bold">PDF</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                {resumeFile.name}
              </p>
              <p className="text-xs text-gray-400">
                {(resumeFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 text-lg font-bold leading-none ml-2"
            aria-label="Remove resume"
          >
            ×
          </button>
        </div>
      ) : (
        /* Drop Zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-lg px-6 py-8 text-center cursor-pointer transition-all duration-200
            ${dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleChange}
          />
          {/* Upload Icon */}
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-700">
            {dragOver ? "Drop your PDF here" : "Drag & drop or click to upload"}
          </p>
          <p className="text-xs text-gray-400 mt-1">PDF only · Max 5MB</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-2 text-xs text-red-500 font-medium">⚠ {error}</p>
      )}
    </div>
  );
};

export default ResumeUploader;
