import { useRef } from "react";
import { validateUpload } from "../../validations/assignmentValidation";
import { Upload, FileText, X } from "lucide-react";

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.zip";

const UploadAssignment = ({ file, onFileChange, error }) => {
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

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-200 ${
          error
            ? "border-red-300 bg-red-50"
            : file
            ? "border-emerald-300 bg-emerald-50"
            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
        }`}
      >
        {file ? (
          <>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to submit
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              error ? "bg-red-100" : "bg-gray-100 group-hover:bg-blue-100"
            }`}>
              <Upload className={`w-6 h-6 ${error ? "text-red-400" : "text-gray-400"}`} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">
                Drop your file here, or{" "}
                <span className="text-blue-600 underline underline-offset-2">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
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
