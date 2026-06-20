import { useEffect } from 'react';
import { X, Download } from 'lucide-react';

export const CandidateDrawer = ({
  isOpen,
  candidate,
  onClose,
  onShortlist,
  onReject,
  isUpdating
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

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 backdrop-blur-sm transition-all duration-200"
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

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Candidate Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {candidate.avatar}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">{candidate.name}</h2>
            <p className="text-gray-600 text-sm mt-2 font-medium">📍 {candidate.college}</p>
          </div>

          {/* Skills Tags */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg font-semibold border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">✉️</span>
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 font-medium break-all">{candidate.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📞</span>
                <div>
                  <p className="text-sm text-gray-700 font-medium">{candidate.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-sm text-gray-700 font-medium">{candidate.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Academic Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">GPA</p>
                <p className="font-bold text-gray-900 text-lg">{candidate.gpa}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Degree</p>
                <p className="font-bold text-gray-900 text-base">{candidate.degree}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Graduation</p>
                <p className="font-bold text-gray-900 text-lg">{candidate.graduationYear}</p>
              </div>
            </div>
          </div>

          {/* Assessment Score */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Assessment Score</h3>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-center text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold">{candidate.score}%</div>
              <div className="text-sm font-medium text-blue-100 mt-3">Overall Score</div>
            </div>
          </div>

          {/* Resume Download */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Resume</h3>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-semibold hover:border-gray-300">
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
          <div className="sticky bottom-0 bg-white border-t border-gray-100 -mx-8 px-8 py-6 flex gap-3">
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base shadow-lg hover:shadow-xl"
            >
              Shortlist
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
