import React, { useRef } from "react";
import { UploadCloud, File, AlertCircle } from "lucide-react";
import { FILE_UPLOAD_LIMITS } from "../../constants/projectConstants";

export const FileUpload = ({ selectedFiles = [], onFilesChange, error }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...selectedFiles, ...newFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesChange([...selectedFiles, ...droppedFiles]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-2">
        Attachment Files (Documents, Videos, Screenshots)
      </label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          error
            ? "border-rose-400 bg-rose-50/50 dark:bg-rose-950/20"
            : "border-surface-300 dark:border-surface-600 hover:border-brand-500 dark:hover:border-brand-400 bg-surface-50/50 dark:bg-surface-900/40"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept={FILE_UPLOAD_LIMITS.ALLOWED_EXTENSIONS.join(",")}
          className="hidden"
        />

        <div className="p-3 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1">
          Click to upload or drag & drop files here
        </p>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          Supported: PDF, ZIP, MP4, PNG, JPG (Max 25MB per file)
        </p>
      </div>

      {error && (
        <div className="flex items-center space-x-1.5 text-xs text-rose-600 mt-2">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
