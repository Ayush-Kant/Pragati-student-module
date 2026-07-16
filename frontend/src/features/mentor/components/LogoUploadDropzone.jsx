import React, { useRef, useState } from "react";
import { uploadLogo } from "../services/certificateService";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "image/webp",
];

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

      const logoUrl = `http://localhost:5000${response.url}`;

      setValue("logo", {
        url: logoUrl,
        preview: logoUrl,
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
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition min-h-[220px] flex items-center justify-center"
      >
        {uploading ? (
          <p className="text-blue-600 font-medium">Uploading...</p>
        ) : logo?.url ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={logo.preview || logo.url}
              alt="Logo"
              className="w-28 h-28 object-contain border rounded-lg p-2 bg-white"
            />

            <div>
              <p className="font-medium text-gray-800">{logo.fileName}</p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setValue("logo", null);

                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <p className="font-medium text-lg">Upload Logo</p>

            <p className="mt-2">
              Click to upload or drag & drop
            </p>

            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG or SVG (Max 2 MB)
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.svg,.webp"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {uploadError && (
        <p className="text-red-500 text-sm">{uploadError}</p>
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