import React, { useRef } from 'react';
import { UploadCloud, File, Trash2, CheckCircle2 } from 'lucide-react';
import { formatFileSize } from '../../utils/projectHelpers';
import { FILE_UPLOAD_CONSTRAINTS } from '../../constants/projectConstants';

export const ProjectFiles = ({ files = [], onFilesChange }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 0 && onFilesChange) {
      onFilesChange([...files, ...selected]);
    }
  };

  const handleRemoveFile = (index) => {
    if (onFilesChange) {
      const updated = files.filter((_, i) => i !== index);
      onFilesChange(updated);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold text-slate-200 block">
        Attach Project Deliverables / Zip Archives
      </label>

      {/* Drag & Drop File Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/50 hover:bg-slate-900/80 rounded-2xl p-6 text-center cursor-pointer transition-all group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept={FILE_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(',')}
        />
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-slate-200">
          Click to upload <span className="text-slate-400 font-normal">or drag & drop project files</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Supported: ZIP, PDF, DOCX, PPTX, PNG (Max size: {FILE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB)
        </p>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <File className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="truncate">
                  <p className="font-semibold text-slate-200 truncate">{file.name}</p>
                  <p className="text-[10px] text-slate-400">{formatFileSize(file.size)}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveFile(idx)}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectFiles;
