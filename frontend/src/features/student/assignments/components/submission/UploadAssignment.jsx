import { useRef } from "react";
import { validateUpload } from "../../validations/assignmentValidation";

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
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
          error
            ? "border-red-300 bg-red-50"
            : file
            ? "border-green-300 bg-green-50"
            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
        }`}
      >
        <span className="text-2xl">{file ? "📄" : "📤"}</span>

        {file ? (
          <div className="text-center">
            <p className="text-sm font-semibold text-green-700">{file.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600">
              Drop your file here, or{" "}
              <span className="text-blue-600 underline">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              PDF, DOC, DOCX, ZIP — max 10 MB
            </p>
          </div>
        )}
      </div>

      {file && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFileChange(null);
          }}
          className="mt-2 text-xs text-red-500 hover:underline"
        >
          Remove file
        </button>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

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
