import { useState, useRef } from 'react';
import { Upload, FileText, Check } from 'lucide-react';
import { isDocumentValid, formatFileSize, fileToDataUrl } from '../../utils/studentProfileHelpers';

const DOCUMENT_TYPES = [
  { value: 'transcript', label: 'Transcript' },
  { value: 'id_proof', label: 'ID Proof' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'other', label: 'Other' }
];

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
    {subtitle && (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    )}
  </div>
);

/**
 * A component for uploading documents.
 * Supports file selection, type selection, validation, and upload simulation.
 * @param {Object} props - The component props
 * @param {Function} [props.onUpload] - Callback when document is uploaded (receives document object)
 * @param {boolean} [props.uploading=false] - Whether upload is in progress
 * @param {number} [props.uploadProgress=0] - Upload progress percentage
 * @returns {JSX.Element} The upload document component
 */
const UploadDocument = ({ onUpload, uploading = false, uploadProgress = 0 }) => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('other');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validation = isDocumentValid(selectedFile);
      if (validation.valid) {
        setFile(selectedFile);
        setError('');
      } else {
        setError(validation.error);
        setFile(null);
      }
    }
    event.target.value = '';
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      const url = await fileToDataUrl(file);
    const document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      fileName: file.name,
      type: documentType,
      url,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };

      onUpload && onUpload(document);
      setFile(null);
      setDocumentType('other');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to process file');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
      <SectionHeader
        title="Upload Document"
        subtitle="Add supporting documents to your profile"
      />

      <div className="space-y-4">
        <div
          onClick={handleClick}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-8 cursor-pointer transition-colors hover:border-orange-300 hover:bg-orange-50/30 dark:border-gray-600 dark:bg-gray-700/50 dark:hover:border-orange-500 dark:hover:bg-orange-900/10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400">
            <Upload className="h-6 w-6" />
          </div>

          {file ? (
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {file.name}
              </span>
              <span className="text-xs text-gray-400">
                ({formatFileSize(file.size)})
              </span>
              <Check className="h-4 w-4 text-green-500" />
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Click to upload a document
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, DOC, DOCX, JPG, PNG (max 10MB)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors bg-white dark:bg-gray-700 dark:text-white"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDocument;
