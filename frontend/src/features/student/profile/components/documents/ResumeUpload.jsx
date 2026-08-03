import { useRef } from 'react';
import { Upload, FileText, Check } from 'lucide-react';
import { isResumeValid, formatFileSize } from '../../utils/studentProfileHelpers';

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const ResumeUpload = ({ resumeFile, onUpload, uploading = false, uploadProgress = 0 }) => {
  const fileInputRef = useRef(null);

  const isFile = resumeFile instanceof File;
  const fileName = isFile ? resumeFile.name : resumeFile?.fileName;
  const fileSize = isFile ? resumeFile.size : resumeFile?.size;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = isResumeValid(file);
      if (validation.valid) {
        onUpload && onUpload(file);
      } else {
        alert(validation.error);
      }
    }
    event.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
      <SectionHeader title="Resume" subtitle="Upload your latest resume" />
      <div
        onClick={handleClick}
        className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-700 bg-white/5 p-8 cursor-pointer transition-colors hover:border-orange-500/50 hover:bg-orange-500/5"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
          <Upload className="h-6 w-6" />
        </div>
        {fileName ? (
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-white">{fileName}</span>
            {fileSize && <span className="text-xs text-gray-400">({formatFileSize(fileSize)})</span>}
            <Check className="h-4 w-4 text-green-500" />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-300">Click to upload your resume</p>
            <p className="text-xs text-gray-500 mt-1">PDF only, max 5MB</p>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
      </div>
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <div className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Uploading... {uploadProgress}%</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
