import React, { useState, useEffect, useRef } from 'react';
import { useFinalProjectSubmission } from '../../hooks/useFinalProjectSubmission';
import { validateFinalProjectSubmission } from '../../validations/projectValidation';
import { formatDate, formatBytes } from '../../utils/projectHelpers';
import { CheckCircle, AlertCircle, Link2, Globe, FileUp, X, Loader2, FileText } from 'lucide-react';

/**
 * FinalSubmitForm component.
 * Features a custom-styled drag-and-drop file dropzone, validations, and submission status indicators.
 */
export const FinalSubmitForm = ({ 
  project, 
  onSubmissionSuccess 
}) => {
  const { submitFinalProject, loading, error: apiError, success, resetStatus } = useFinalProjectSubmission();
  const fileInputRef = useRef(null);

  // Form states
  const [githubUrl, setGithubUrl] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when project changes
  useEffect(() => {
    resetStatus();
    setErrors({});
    if (project?.submission) {
      setGithubUrl(project.submission.githubUrl || '');
      setDeployedUrl(project.submission.deployedUrl || '');
      // Create a mock file representation if already submitted
      if (project.submission.reportFileName) {
        setReportFile({
          name: project.submission.reportFileName,
          size: 0, // Mock size or display formatted string from DB
          isMock: true,
          mockSizeStr: project.submission.reportFileSize
        });
      } else {
        setReportFile(null);
      }
    } else {
      setGithubUrl('');
      setDeployedUrl('');
      setReportFile(null);
    }
  }, [project, resetStatus]);

  if (!project) return null;

  const isOverdue = new Date(project.finalDueAt) < new Date();
  const isSubmitted = !!project.submission;
  const isDisabled = isSubmitted || isOverdue;

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (isDisabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (isDisabled) return;
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleFileChange = (file) => {
    // Basic pre-validation for UI responsiveness
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrors(prev => ({ ...prev, reportFile: "Only PDF documents are accepted." }));
      setReportFile(null);
      return;
    }
    const maxBytes = 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrors(prev => ({ ...prev, reportFile: "File size exceeds the 20MB limit." }));
      setReportFile(null);
      return;
    }

    setErrors(prev => ({ ...prev, reportFile: null }));
    setReportFile(file);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    if (isDisabled) return;
    setReportFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    const payload = {
      githubUrl,
      deployedUrl,
      reportFile: reportFile && !reportFile.isMock ? reportFile : null
    };

    const validation = validateFinalProjectSubmission(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    try {
      // In a real app we might construct a FormData
      // Since projectService handles both styled inputs, we'll pass standard object or mock FormData
      const formData = new FormData();
      formData.append('githubUrl', githubUrl);
      if (deployedUrl) formData.append('deployedUrl', deployedUrl);
      if (reportFile && !reportFile.isMock) {
        formData.append('reportFile', reportFile);
      }

      await submitFinalProject(project.projectId, formData);
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }
    } catch {
      // API error handled by hook
    }
  };

  // Render Success UI
  if (success) {
    return (
      <div className="bg-pragati-surface border border-pragati-success/20 rounded-xl p-8 text-center shadow-xl transition-all duration-300">
        <div className="mx-auto w-16 h-16 bg-pragati-success/10 border border-pragati-success/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-pragati-success" />
        </div>
        <h3 className="text-xl font-bold text-pragati-text">Final Project Submitted!</h3>
        <p className="text-sm text-pragati-muted mt-2 max-w-md mx-auto">
          Congratulations! Your final project submission has been locked and queued for grading evaluation.
        </p>

        <div className="mt-6 p-4 bg-pragati-bg border border-pragati-border rounded-xl text-left space-y-2 max-w-md mx-auto text-xs">
          <div className="flex items-center gap-2 text-pragati-text">
            <Link2 className="w-4 h-4 text-pragati-accent" />
            <span className="font-semibold">GitHub:</span>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-pragati-accent hover:underline truncate">
              {githubUrl}
            </a>
          </div>
          {deployedUrl && (
            <div className="flex items-center gap-2 text-pragati-text">
              <Globe className="w-4 h-4 text-pragati-success" />
              <span className="font-semibold">Live Site:</span>
              <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="text-pragati-success hover:underline truncate">
                {deployedUrl}
              </a>
            </div>
          )}
          {reportFile && (
            <div className="flex items-center gap-2 text-pragati-text pt-2 border-t border-pragati-border mt-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="font-semibold">Report PDF:</span>
              <span className="text-slate-300 truncate flex-1">{reportFile.name}</span>
              <span className="text-[10px] text-pragati-muted">
                ({reportFile.isMock ? reportFile.mockSizeStr : formatBytes(reportFile.size)})
              </span>
            </div>
          )}
        </div>

        <button 
          onClick={resetStatus}
          className="mt-6 px-5 py-2 bg-pragati-surface hover:bg-pragati-bg text-pragati-text border border-pragati-border hover:border-pragati-muted text-sm font-semibold rounded-lg transition-all duration-200"
        >
          View Final Form
        </button>
      </div>
    );
  }

  return (
    <div className="bg-pragati-surface border border-pragati-border rounded-xl p-6 shadow-xl">
      <div className="border-b border-pragati-border pb-4 mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-pragati-text">
            Final Project Submission
          </h3>
          <p className="text-xs text-pragati-muted mt-1">
            Deadline: {formatDate(project.finalDueAt)}
          </p>
        </div>
      </div>

      {/* Deadline alert banner */}
      {isOverdue && !isSubmitted && (
        <div className="mb-6 p-4 bg-pragati-danger/10 border border-pragati-danger/20 rounded-xl text-xs md:text-sm text-pragati-danger flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Portal Closed:</span> The final submission deadline passed on {formatDate(project.finalDueAt)}. Submissions are locked and can no longer be processed.
          </div>
        </div>
      )}

      {/* Submitted Alert banner */}
      {isSubmitted && (
        <div className="mb-6 p-4 bg-pragati-success/10 border border-pragati-success/20 rounded-xl text-xs md:text-sm text-pragati-success flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Final Project Submitted:</span> Recorded on {project.submission ? formatDate(project.submission.submittedAt) : 'N/A'}. This project is currently in queue.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* GitHub URL */}
        <div>
          <label htmlFor="final-github" className="block text-sm font-semibold text-pragati-text mb-2 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-pragati-accent" />
            Repository GitHub URL <span className="text-pragati-danger">*</span>
          </label>
          <input
            id="final-github"
            type="text"
            placeholder="https://github.com/username/repo-name"
            value={githubUrl}
            onChange={(e) => {
              setGithubUrl(e.target.value);
              if (errors.githubUrl) setErrors(prev => ({ ...prev, githubUrl: null }));
            }}
            disabled={isDisabled}
            className={`w-full bg-pragati-bg border rounded-xl px-4 py-3 text-sm text-pragati-text placeholder-slate-600 focus:outline-none focus:ring-1 transition-all duration-200 ${
              errors.githubUrl 
                ? 'border-pragati-danger focus:ring-pragati-danger focus:border-pragati-danger' 
                : 'border-pragati-border focus:ring-pragati-accent focus:border-pragati-accent'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {errors.githubUrl && (
            <p className="text-xs text-pragati-danger mt-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.githubUrl}
            </p>
          )}
          <span className="text-[10px] text-pragati-muted mt-1 block">
            Tip: Use <code className="text-pragati-accent bg-pragati-bg px-1 rounded">https://github.com/.../error-413</code> to test simulated size/payload limit API error response.
          </span>
        </div>

        {/* Deployed URL */}
        <div>
          <label htmlFor="final-deploy" className="block text-sm font-semibold text-pragati-text mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-pragati-success" />
            Live Deployment URL <span className="text-pragati-muted font-normal">(Optional)</span>
          </label>
          <input
            id="final-deploy"
            type="text"
            placeholder="https://my-capstone.vercel.app"
            value={deployedUrl}
            onChange={(e) => {
              setDeployedUrl(e.target.value);
              if (errors.deployedUrl) setErrors(prev => ({ ...prev, deployedUrl: null }));
            }}
            disabled={isDisabled}
            className={`w-full bg-pragati-bg border rounded-xl px-4 py-3 text-sm text-pragati-text placeholder-slate-600 focus:outline-none focus:ring-1 transition-all duration-200 ${
              errors.deployedUrl 
                ? 'border-pragati-danger focus:ring-pragati-danger focus:border-pragati-danger' 
                : 'border-pragati-border focus:ring-pragati-accent focus:border-pragati-accent'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {errors.deployedUrl && (
            <p className="text-xs text-pragati-danger mt-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.deployedUrl}
            </p>
          )}
        </div>

        {/* PDF File Uploader (Dropzone) */}
        <div>
          <label className="block text-sm font-semibold text-pragati-text mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Project PDF Report <span className="text-pragati-muted font-normal">(Optional)</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInputChange}
            disabled={isDisabled}
            className="hidden"
          />

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            className={`w-full rounded-xl border-2 border-dashed py-8 px-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
              dragActive 
                ? 'border-pragati-accent bg-pragati-accent/5' 
                : reportFile 
                  ? 'border-pragati-success/30 bg-pragati-success/5' 
                  : 'border-pragati-border bg-pragati-bg hover:border-slate-700'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed border-pragati-border hover:border-pragati-border bg-pragati-bg' : ''}`}
          >
            {reportFile ? (
              <div className="flex flex-col items-center w-full max-w-xs">
                <FileText className="w-10 h-10 text-pragati-success mb-2" />
                <span className="text-xs font-semibold text-pragati-text truncate w-full">
                  {reportFile.name}
                </span>
                <span className="text-[10px] text-pragati-muted mt-0.5">
                  {reportFile.isMock ? reportFile.mockSizeStr : formatBytes(reportFile.size)}
                </span>
                {!isDisabled && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="mt-3 px-3 py-1 bg-pragati-danger/10 border border-pragati-danger/20 hover:bg-pragati-danger/20 text-pragati-danger text-[10px] font-bold uppercase rounded-lg flex items-center gap-1.5 transition-colors duration-150"
                  >
                    <X className="w-3 h-3" /> Remove File
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FileUp className="w-10 h-10 text-pragati-muted group-hover:text-slate-400 mb-2 transition-colors duration-200" />
                <p className="text-xs md:text-sm font-semibold text-pragati-text">
                  Drag and drop your PDF report here, or <span className="text-pragati-accent hover:underline">browse</span>
                </p>
                <p className="text-[10px] text-pragati-muted mt-1.5">
                  PDF format only. Size cap: 20MB.
                </p>
              </div>
            )}
          </div>
          
          {errors.reportFile && (
            <p className="text-xs text-pragati-danger mt-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.reportFile}
            </p>
          )}
        </div>

        {/* Global/API errors */}
        {apiError && (
          <div className="p-3 bg-pragati-danger/10 border border-pragati-danger/20 rounded-lg text-xs text-pragati-danger flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Action Button */}
        {!isDisabled && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pragati-accent to-amber-500 hover:from-amber-500 hover:to-pragati-accent text-pragati-bg font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading & Submitting...
              </>
            ) : (
              'Submit Final Project'
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default FinalSubmitForm;
