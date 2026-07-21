import React, { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import { uploadLogo } from "../services/certificateService";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

const LogoUploadDropzone = ({ watch, setValue, errors }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const logo = watch("logo");

  const handleFile = async (file) => {
    if (!file) return;
    setUploadError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only PNG, JPG and SVG files are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Maximum file size is 2 MB.");
      return;
    }

    try {
      setUploading(true);
      const response = await uploadLogo(file);
      const logoUrl = response.url.startsWith("http") || response.url.startsWith("blob")
        ? response.url
        : `http://localhost:5000${response.url}`;

      setValue("logo", {
        url: logoUrl,
        preview: logoUrl,
        fileName: file.name,
      });
    } catch (err) {
      setUploadError("Failed to upload logo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-400 bg-gray-50/50 p-6 text-center transition hover:bg-gray-50"
      >
        {uploading ? (
          <p className="font-medium text-blue-600">Uploading...</p>
        ) : logo?.url ? (
          <div className="flex flex-col items-center gap-3">
            <img src={logo.preview || logo.url} alt="Logo" className="h-16 w-16 object-contain" />
            <p className="text-sm font-medium text-gray-800">{logo.fileName}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setValue("logo", null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-xs font-semibold text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <CloudUpload size={32} className="mb-3 text-gray-400" />
            <p className="text-sm font-bold text-gray-900">Click to upload or drag & drop</p>
            <p className="mt-1 text-xs text-gray-500">SVG, PNG, JPG (max. 2MB)</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.svg"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
      {errors.logo && <p className="text-sm text-red-500">{errors.logo.message}</p>}
    </div>
  );
};

export default LogoUploadDropzone;