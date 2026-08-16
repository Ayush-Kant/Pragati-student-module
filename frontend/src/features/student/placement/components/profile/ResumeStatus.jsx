// src/features/student/placement/components/profile/ResumeStatus.jsx
// Displays ATS score, verification status, file details, and review feedback.

import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { getResumeStatusBadge } from '../../utils/placementHelpers';
import ConfirmationModal from '../common/ConfirmationModal';

export default function ResumeStatus({ resume, onUploadResume }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const status = resume?.status || 'Not Uploaded';
  const score = resume?.score ?? 82; // backend-provided
  const badge = getResumeStatusBadge(status);
  const fileName = resume?.fileName || 'resume_2024.pdf';
  const feedback = resume?.feedback || 'Good project representation. Quantify internship impacts.';

  const handleConfirmUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsModalOpen(false);
      if (onUploadResume) onUploadResume();
    }, 600);
  };

  return (
    <div className="card shadow-card hover:shadow-card-md transition-shadow">
      <div className="flex items-start justify-between pb-3 mb-4 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="section-title text-base">Verified Placement Resume</h3>
            <p className="text-xs text-surface-500">Official document used for campus applications</p>
          </div>
        </div>

        <span className={`badge px-3 py-1 text-xs font-semibold ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* ATS Score */}
        <div className="p-4 rounded-xl bg-surface-50 border border-surface-100 flex flex-col justify-between">
          <span className="text-xs font-medium text-surface-500">ATS Readiness Score</span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl font-bold text-emerald-600">{score}</span>
            <span className="text-xs text-surface-400">/100</span>
          </div>
          <span className="text-2xs text-surface-500">Automated parser compliance</span>
        </div>

        {/* Current File */}
        <div className="p-4 rounded-xl bg-surface-50 border border-surface-100 flex flex-col justify-between">
          <span className="text-xs font-medium text-surface-500">Active File</span>
          <div className="flex items-center gap-2 my-1 truncate">
            <FileText className="w-4 h-4 text-primary-600 shrink-0" />
            <span className="text-xs font-semibold text-surface-800 truncate" title={fileName}>
              {fileName}
            </span>
          </div>
          <span className="text-2xs text-surface-400">
            {resume?.uploadedAt
              ? `Uploaded on ${new Date(resume.uploadedAt).toLocaleDateString('en-IN')}`
              : 'Uploaded recently'}
          </span>
        </div>

        {/* Action Button */}
        <div className="p-4 rounded-xl bg-primary-50/40 border border-primary-100 flex flex-col justify-between">
          <span className="text-xs font-medium text-primary-900">Update Resume</span>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary w-full text-xs py-2 justify-center shadow-xs mt-2"
          >
            <UploadCloud className="w-4 h-4" />
            Upload New PDF
          </button>
        </div>
      </div>

      {/* Reviewer Feedback Box */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs flex items-start gap-2.5">
          <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-900">Placement Coordinator Feedback: </span>
            <span className="text-indigo-800/90">{feedback}</span>
          </div>
        </div>
      )}

      {/* Upload Confirmation / File Selection Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Upload Placement Resume"
        message="Uploading a new resume will replace the active file and trigger an automated ATS scan and placement coordinator review. Are you sure you want to proceed?"
        confirmLabel="Select & Upload PDF"
        onConfirm={handleConfirmUpload}
        onClose={() => setIsModalOpen(false)}
        isLoading={isUploading}
      />
    </div>
  );
}
