import React from "react";
import { FileText, X, Download } from "lucide-react";
import { formatFileSize } from "../../utils/projectHelpers";

export const UploadedFiles = ({ files = [], onRemoveFile }) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="mb-6 space-y-2">
      <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
        Attached Files ({files.length})
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {files.map((file, index) => {
          const fileName = file.name || file.filename;
          const fileSize = file.size;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-900/60 rounded-xl border border-surface-200 dark:border-surface-700"
            >
              <div className="flex items-center space-x-3 truncate">
                <div className="p-2 bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 rounded-lg shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-surface-900 dark:text-white truncate">{fileName}</p>
                  {fileSize && (
                    <p className="text-[10px] text-surface-400 dark:text-surface-500">{formatFileSize(fileSize)}</p>
                  )}
                </div>
              </div>

              {onRemoveFile && (
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="p-1 text-surface-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UploadedFiles;
