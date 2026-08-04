import { useEffect } from 'react';
import { X, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const getAvatarBgColor = (avatar) => {
  const av = (avatar || "").toUpperCase();
  if (av === "RP") return "#1e88e5"; // blue
  if (av === "PS") return "#0284c7"; // light blue
  if (av === "AK") return "#3f51b5"; // indigo
  if (av === "SR") return "#00bcd4"; // cyan
  if (av === "VS") return "#1565c0"; // dark blue
  return "#3b82f6"; // default blue
};

export const CandidateDrawer = ({
  isOpen,
  candidate,
  onClose,
  onShortlist,
  onReject,
  isUpdating,
  inline = false
}) => {
  // Handle ESC key to close drawer
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) return null;

  const content = (
    <div className={inline ? 'p-6 space-y-6' : 'p-8 space-y-8'}>
      {/* Candidate Header */}
      <div className="flex items-center gap-4 relative pr-8">
        <div 
          className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0"
          style={{ backgroundColor: getAvatarBgColor(candidate.avatar) }}
        >
          {candidate.avatar}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1 font-medium">
            <span className="text-gray-400">🎓</span>
            <span>{candidate.college}</span>
          </div>
        </div>
      </div>

      {/* Skills Tags */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-semibold border border-blue-100/50"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
            <span className="text-gray-400 text-base">✉️</span>
            <span className="break-all">{candidate.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
            <span className="text-gray-400 text-base">📞</span>
            <span>{candidate.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
            <span className="text-gray-400 text-base">📍</span>
            <span>{candidate.location}</span>
          </div>
        </div>
      </div>

      {/* Academic Details */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Academic Details</h3>
        <div className="bg-gray-50 rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-500">GPA</span>
            <span className="text-gray-950 font-semibold">{candidate.gpa}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-500">Degree</span>
            <span className="text-gray-950 font-semibold">{candidate.degree}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-500">Graduation Year</span>
            <span className="text-gray-950 font-semibold">{candidate.graduationYear}</span>
          </div>
        </div>
      </div>

      {/* Assessment Score */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Assessment Score</h3>
        <div 
          className="rounded-xl p-8 text-center text-white shadow-lg hover:shadow-xl transition-shadow"
          style={{ backgroundColor: '#38bdf8' }}
        >
          <div className="text-5xl font-bold text-white">{candidate.score}%</div>
          <div className="text-sm font-medium text-white/95 mt-3">Overall Score</div>
        </div>
      </div>

      {/* Resume Download */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Resume</h3>
        <button
          onClick={() => {
            if (!candidate) return;
            const rawResumeName = candidate.resume || `${candidate.name.replace(/\s+/g, '_')}_resume.pdf`;
            const fileName = rawResumeName.endsWith('.pdf') 
              ? rawResumeName.replace('.pdf', '_resume.txt') 
              : `${rawResumeName}_resume.txt`;
            const resumeText = `
==================================================
              PRAGATI CAREER PORTAL
                CANDIDATE RESUME
==================================================

CANDIDATE PROFILE:
------------------
Name:            ${candidate.name}
College:         ${candidate.college}
Degree:          ${candidate.degree || 'B.Tech / B.E'}
Graduation:      Class of ${candidate.graduationYear || '2026'}
GPA:             ${candidate.gpa || 'N/A'} / 10.0

CONTACT DETAILS:
----------------
Email:           ${candidate.email}
Phone:           ${candidate.phone}
Address:         ${candidate.location || 'N/A'}

TECHNICAL SKILLS:
-----------------
${candidate.skills && candidate.skills.length > 0 ? candidate.skills.join(', ') : 'React, Node.js, JavaScript'}

ASSESSMENT & TRAINING METRICS:
------------------------------
Assessment Score:   ${candidate.score || 0}%
Training Progress:  ${candidate.trainingProgress || 0}%

FEEDBACK & NOTES:
-----------------
${candidate.feedback || 'Highly recommended candidate.'}
`;
            const blob = new Blob([resumeText.trim()], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            toast.success(`Resume (${fileName}) downloaded successfully!`);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-semibold hover:border-gray-300 cursor-pointer"
        >
          <Download size={20} />
          <span>Download Resume</span>
        </button>
      </div>

      {/* Interview Feedback */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Interview Feedback</h3>
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-5">
          <p className="text-sm text-gray-700 leading-relaxed">
            {candidate.feedback}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`sticky bottom-0 bg-white border-t border-gray-100 ${inline ? '-mx-6 px-6' : '-mx-8 px-8'} py-6 flex gap-3`}>
        <button
          onClick={() => onReject(candidate.id)}
          disabled={isUpdating}
          className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base"
        >
          Reject
        </button>
        <button
          onClick={() => onShortlist(candidate.id)}
          disabled={isUpdating}
          className="flex-1 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#3b82f6' }}
        >
          Shortlist
        </button>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="w-full bg-white h-[calc(100vh-110px)] overflow-y-auto relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-150 flex items-center justify-center bg-white border border-gray-100"
          style={{ zIndex: 100 }}
          aria-label="Close candidate details"
        >
          <span className="text-gray-600 text-xl font-light leading-none">×</span>
        </button>
        {content}
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-all duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="responsive-drawer fixed right-0 top-[68px] h-[calc(100vh-68px)] w-96 bg-white shadow-2xl z-50 overflow-y-auto animate-slideIn">
        {/* Close Button - Positioned inside drawer */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-3 hover:bg-gray-100 rounded-full transition-colors duration-150 flex items-center justify-center bg-white"
          style={{ zIndex: 100 }}
          aria-label="Close candidate details"
        >
          <span className="text-gray-600 text-2xl font-light leading-none">×</span>
        </button>
        {content}
      </div>
    </>
  );
};
