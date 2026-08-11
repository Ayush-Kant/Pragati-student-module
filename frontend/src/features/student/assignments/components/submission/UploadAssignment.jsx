import { useRef } from "react";
import { validateSubmission } from "../../utils/assignmentValidation";
import { Upload, FileText, X } from "lucide-react";

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.zip";

const UploadAssignment = ({ file, onFileChange, error, darkMode = false }) => {
  const inputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    const uploadErrors = validateUpload(selectedFile);
    if (Object.keys(uploadErrors).length === 0) {
      onFileChange(selectedFile);
    } else {
      onFileChange(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleBrowseClick = () => {
  if (file) return; // Don't reopen picker when a file is already selected
  inputRef.current?.click();
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleBrowseClick}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-200 ${
          error
            ? darkMode
              ? "border-red-700 bg-red-900/10"
              : "border-red-300 bg-red-50"
            : file
            ? darkMode
              ? "border-emerald-700 bg-emerald-900/10"
              : "border-emerald-300 bg-emerald-50"
            : darkMode
            ? "border-slate-600 bg-slate-800 hover:border-blue-600 hover:bg-blue-900/10"
            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
        }`}
      >
        {file ? (
          <>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${darkMode ? "bg-emerald-900/30" : "bg-emerald-100"}`}>
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-center">
              <p className={`text-sm font-semibold ${darkMode ? "text-emerald-400" : "text-emerald-700"}`}>{file.name}</p>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to submit
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              error
                ? darkMode ? "bg-red-900/30" : "bg-red-100"
                : darkMode ? "bg-slate-700" : "bg-gray-100"
            }`}>
              <Upload className={`w-6 h-6 ${error ? (darkMode ? "text-red-400" : "text-red-400") : (darkMode ? "text-slate-400" : "text-gray-400")}`} />
            </div>
            <div className="text-center">
              <p className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
                Drop your file here, or{" "}
                <span className="text-blue-500 underline underline-offset-2">browse</span>
              </p>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                PDF, DOC, DOCX, ZIP — max 10 MB
              </p>
            </div>
          </>
        )}
      </div>

      {file && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFileChange(null);
          }}
          className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          <X className="w-3 h-3" />
          Remove file
        </button>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) handleFileSelect(selected);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default UploadAssignment;
