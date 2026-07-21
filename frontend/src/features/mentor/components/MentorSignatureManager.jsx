import React, { useRef, useState } from "react";
import { Trash2, Plus, FileSignature } from "lucide-react";
import { uploadSignature } from "../services/certificateService";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

const MentorSignatureManager = ({ watch, setValue, errors }) => {
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
      const signatureUrl = response.url.startsWith("http") || response.url.startsWith("blob")
        ? response.url
        : `http://localhost:5000${response.url}`;

      setValue("signature", {
        url: signatureUrl,
        preview: signatureUrl,
        fileName: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
      });
    } catch (err) {
      setUploadError("Failed to upload signature.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {signature?.url ? (
        <>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                <FileSignature size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{signature.fileName}</p>
                <p className="text-xs text-gray-500">{signature.size}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setValue("signature", null)}
              className="text-red-500 transition hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <Plus size={16} className="mr-1" /> Replace Signature
          </button>
        </>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-400 bg-gray-50/50 p-6 text-center transition hover:bg-gray-50"
        >
          {uploading ? (
            <p className="font-medium text-blue-600">Uploading...</p>
          ) : (
            <p className="text-sm font-bold text-gray-900">Upload Signature</p>
          )}
        </div>
      )}

      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
      {errors.signature && <p className="text-sm text-red-500">{errors.signature.message}</p>}
    </div>
  );
};

export default MentorSignatureManager;