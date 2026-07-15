import React, { useRef, useState } from "react";
import { uploadLogo } from "../services/certificateService";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];

const LogoUploadDropzone = ({
  watch,
  setValue,
  errors,
}) => {
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

      setValue("logo", {
        url: response.url,
        fileName: file.name,
      });
    } catch (err) {
      console.error(err);
      setUploadError("Failed to upload logo.");
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();

    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition"
      >
        {uploading ? (
          <p className="text-blue-600 font-medium">
            Uploading...
          </p>
        ) : (
          <>
            <p className="font-medium">
              Click to upload or drag & drop
            </p>

            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG or SVG (Max 2 MB)
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.svg"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {logo?.url && (
        <div className="border rounded-lg p-3 flex items-center gap-3">
          <img
            src={logo.url}
            alt="Logo"
            className="w-14 h-14 object-contain border rounded"
          />

          <div className="flex-1">
            <p className="font-medium">
              {logo.fileName}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setValue("logo", null)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      )}

      {uploadError && (
        <p className="text-red-500 text-sm">
          {uploadError}
        </p>
      )}

      {errors.logo && (
        <p className="text-red-500 text-sm">
          {errors.logo.message}
        </p>
      )}
    </div>
  );
};

export default LogoUploadDropzone;