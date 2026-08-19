import { UploadCloud, File, X, RotateCcw, StopCircle, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { UPLOAD_STATE, ACCEPTED_EXTENSIONS } from '../../constants/projectConstants';
import { formatFileSize } from '../../utils/submissionHelpers';

/**
 * Drag-and-drop file upload zone.
 *
 * @param {{
 *   isDragging: boolean,
 *   validationErrors: string[],
 *   onDragOver: Function,
 *   onDragLeave: Function,
 *   onDrop: Function,
 *   onBrowse: (files: FileList) => void,
 * }} props
 */
export const FileUploadZone = ({
  isDragging,
  validationErrors,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowse,
}) => {
  const handleInputChange = (e) => {
    if (e.target.files?.length) {
      onBrowse(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-violet-500/70 bg-violet-500/8 scale-[1.01]'
            : 'border-gray-700 hover:border-gray-600 bg-white/2'
        }`}
        aria-label="File upload drop zone"
      >
        <UploadCloud
          size={36}
          className={`mx-auto mb-3 transition-colors ${isDragging ? 'text-violet-400' : 'text-gray-600'}`}
          aria-hidden="true"
        />
        <p className="text-sm text-gray-300 mb-1">
          Drag &amp; drop files here, or{' '}
          <label
            htmlFor="file-browse"
            className="text-violet-400 underline cursor-pointer hover:text-violet-300 transition-colors"
          >
            browse
          </label>
        </p>
        <p className="text-xs text-gray-600">
          Accepted: {ACCEPTED_EXTENSIONS} · Max 25 MB per file · 50 MB total
        </p>
        <input
          id="file-browse"
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS}
          onChange={handleInputChange}
          className="sr-only"
          aria-label="Browse files"
        />
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 space-y-1">
          {validationErrors.map((err, i) => (
            <p key={i} className="text-xs text-red-400 flex items-start gap-1.5">
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * List of file entries with per-file upload state indicators.
 *
 * @param {{
 *   fileEntries: object[],
 *   onRemove: (id: string) => void,
 *   onRetry: (id: string) => void,
 *   onCancel: (id: string) => void,
 * }} props
 */
export const FileList = ({ fileEntries, onRemove, onRetry, onCancel }) => {
  if (!fileEntries?.length) return null;

  return (
    <ul className="space-y-2" aria-label="Attached files">
      {fileEntries.map((entry) => (
        <li
          key={entry.id}
          className="flex items-center gap-3 bg-white/2 border border-white/6 rounded-xl px-4 py-2.5"
        >
          {/* File icon */}
          <File size={16} className="flex-shrink-0 text-gray-500" aria-hidden="true" />

          {/* Name + size */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-200 truncate font-medium">{entry.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-600">{formatFileSize(entry.size)}</span>
              {entry.state === UPLOAD_STATE.UPLOADING && (
                <span className="text-xs text-blue-400">{entry.progress}%</span>
              )}
              {entry.state === UPLOAD_STATE.ERROR && (
                <span className="text-xs text-red-400 truncate">{entry.error}</span>
              )}
            </div>
            {/* Progress bar */}
            {entry.state === UPLOAD_STATE.UPLOADING && (
              <div className="mt-1 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-violet-500 rounded-full transition-all duration-300"
                  style={{ width: `${entry.progress}%` }}
                />
              </div>
            )}
          </div>

          {/* State icon */}
          <div className="flex-shrink-0">
            {entry.state === UPLOAD_STATE.SUCCESS && (
              <CheckCircle2 size={16} className="text-emerald-400" aria-label="Uploaded" />
            )}
            {entry.state === UPLOAD_STATE.UPLOADING && (
              <Loader2 size={16} className="text-blue-400 animate-spin" aria-label="Uploading" />
            )}
            {entry.state === UPLOAD_STATE.ERROR && (
              <AlertCircle size={16} className="text-red-400" aria-label="Failed" />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {entry.state === UPLOAD_STATE.ERROR && (
              <button
                type="button"
                onClick={() => onRetry(entry.id)}
                className="p-1 text-gray-500 hover:text-blue-400 transition-colors"
                aria-label={`Retry upload for ${entry.name}`}
              >
                <RotateCcw size={14} aria-hidden="true" />
              </button>
            )}
            {entry.state === UPLOAD_STATE.UPLOADING && (
              <button
                type="button"
                onClick={() => onCancel(entry.id)}
                className="p-1 text-gray-500 hover:text-yellow-400 transition-colors"
                aria-label={`Cancel upload for ${entry.name}`}
              >
                <StopCircle size={14} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              className="p-1 text-gray-600 hover:text-red-400 transition-colors"
              aria-label={`Remove ${entry.name}`}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
