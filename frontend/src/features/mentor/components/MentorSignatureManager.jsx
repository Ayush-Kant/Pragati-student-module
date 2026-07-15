import React, { useRef, useState } from "react";
import { uploadSignature } from "../services/certificateService";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];

const MentorSignatureManager = ({
  watch,
  setValue,
  errors,
}) => {
  const inputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const signature = watch("signature");

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

      const response = await uploadSignature(file);

      setValue("signature", {
        url: response.url,
        fileName: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
    } catch (err) {
      console.error(err);
      setUploadError("Failed to upload signature.");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        className="hidden"
        onChange={onFileChange}
      />

      {signature?.url ? (
        <div className="border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={signature.url}
              alt="Signature"
              className="w-20 h-12 object-contain border rounded bg-white"
            />

            <div>
              <p className="font-medium text-sm">
                {signature.fileName}
              </p>

              <p className="text-xs text-gray-500">
                {signature.size}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setValue("signature", null)}
            className="text-red-500 text-sm hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50"
        >
          {uploading ? (
            <p className="text-blue-600 font-medium">
              Uploading...
            </p>
          ) : (
            <>
              <p className="font-medium">
                Upload Signature
              </p>

              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG or SVG (Max 2 MB)
              </p>
            </>
          )}
        </div>
      )}

      {signature?.url && (
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Replace Signature
        </button>
      )}

      {uploadError && (
        <p className="text-red-500 text-sm">
          {uploadError}
        </p>
      )}

      {errors.signature && (
        <p className="text-red-500 text-sm">
          {errors.signature.message}
        </p>
      )}
    </div>
  );
};

export default MentorSignatureManager;