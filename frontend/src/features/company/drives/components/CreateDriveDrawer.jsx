import { useEffect } from 'react';
import { X } from 'lucide-react';

export const CreateDriveDrawer = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          bg-black/30
          backdrop-blur-sm
          z-40
        "
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="
          fixed
          top-0
          right-0
          h-screen
          w-[420px]
          bg-white
          shadow-2xl
          z-50
          overflow-y-auto
          flex
          flex-col
          rounded-l-3xl
        "
      >
        <div className="pt-24">
          {/* Header */}
          <div className="px-7 pb-6 flex items-start justify-between">
            <h2 className="text-[40px] leading-tight font-bold text-gray-900">
              Create Recruitment Drive
            </h2>

            <button
              onClick={onClose}
              className="
                mt-2
                ml-4
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                hover:bg-gray-100
                transition
                text-gray-500
                hover:text-gray-800
                shrink-0
              "
            >
              <X size={22} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              placeholder="e.g., Senior Software Engineer"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm appearance-none">
              <option>Engineering</option>
              <option>Sales</option>
              <option>Marketing</option>
              <option>HR</option>
            </select>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills</label>
            <input
              type="text"
              placeholder="React, Node.js, MongoDB"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Mini Info Cards 1 */}
          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-xs font-medium text-blue-500">
                Candidates
              </p>
              <h3 className="text-2xl font-bold text-blue-700 mt-1">
                245
              </h3>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <p className="text-xs font-medium text-emerald-500">
                Active
              </p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">
                Live
              </h3>
            </div>
          </div>

          {/* Salary Package */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Package</label>
            <input
              type="text"
              placeholder="₹12-15 LPA"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Work Mode</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="workMode" value="remote" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-700">Remote</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="workMode" value="onsite" className="w-4 h-4" />
                <span className="text-sm text-gray-700">On-site</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="workMode" value="hybrid" className="w-4 h-4" />
                <span className="text-sm text-gray-700">Hybrid</span>
              </label>
            </div>
          </div>

          {/* Job Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Location</label>
            <div className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600">
              <span className="text-lg">📍</span>
              <span>Bangalore, India</span>
            </div>
          </div>

          {/* Eligibility */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Eligibility</label>
            <input
              type="text"
              placeholder="B.Tech/M.Tech, 2024-2026 batch"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Mini Info Cards 2 */}
          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
              <p className="text-xs font-medium text-purple-500">
                Interviews
              </p>
              <h3 className="text-2xl font-bold text-purple-700 mt-1">
                148
              </h3>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <p className="text-xs font-medium text-orange-500">
                Success
              </p>
              <h3 className="text-2xl font-bold text-orange-700 mt-1">
                78%
              </h3>
            </div>
          </div>

          {/* Application Deadline */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Application Deadline</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
            <textarea
              placeholder="Describe the role, responsibilities, and requirements..."
              rows="6"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
            />
          </div>

          {/* Extra space for sticky buttons */}
          <div className="h-24" />
          </div>
        </div>

        {/* Sticky Footer Buttons */}
        <div className="fixed bottom-0 right-0 w-[420px] bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all">
            Publish Drive
          </button>
        </div>
      </div>
    </>
  );
};
