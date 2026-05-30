import React from 'react';
import { Info, HelpCircle, X } from 'lucide-react';

export default function Step4AdditionalSettings({ courseData, onUpdate, onBack }) {
  
  const handleToggle = (field) => {
    onUpdate({ [field]: !courseData[field] });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column Controls Block Configuration Context Frame */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6 shadow-sm">
        {/* Visibility Setting Selection Matrix Wrapper */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label className="text-sm font-semibold text-gray-800">Course Status</label>
            <div className="group relative cursor-pointer text-gray-400 hover:text-gray-600">
              <Info size={14} />
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded w-48 shadow-lg z-20">
                You can change the status of your course anytime before publishing.
              </div>
            </div>
          </div>
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            {[
              { id: 'Draft', title: 'Draft', desc: 'Only admins can see this course' },
              { id: 'Published', title: 'Published', desc: 'Course will be visible to all learners' },
              { id: 'Private', title: 'Private', desc: 'Only specific users can access this course' }
            ].map(status => (
              <label key={status.id} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="courseStatus"
                  checked={courseData.visibility === status.id}
                  onChange={() => onUpdate({ visibility: status.id })}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-sm font-semibold text-gray-700">{status.title}</span>
                  <span className="block text-xs text-gray-400">{status.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Multi Category Chips Collection Segment Panel UI */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Course Category & Tags</label>
          <div className="space-y-3">
            <div>
              <span className="block text-xs font-medium text-gray-500 mb-1">Categories Matrix</span>
              <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-lg bg-gray-50">
                <span className="bg-white border text-gray-700 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-medium">
                  Web Development <X size={12} className="text-gray-400 cursor-pointer" />
                </span>
              </div>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500 mb-1">Tags Feed</span>
              <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-lg bg-gray-50">
                {['JavaScript', 'Frontend', 'Beginner'].map(tag => (
                  <span key={tag} className="bg-white border text-gray-700 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-medium">
                    {tag} <X size={12} className="text-gray-400 cursor-pointer" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Core Evaluation Field Text Area Module block */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-gray-800">Course Requirements</label>
            <span className="text-xs text-gray-400">{courseData.requirements?.length || 0}/500</span>
          </div>
          <textarea
            maxLength={500}
            rows={4}
            value={courseData.requirements}
            onChange={(e) => onUpdate({ requirements: e.target.value })}
            placeholder="Enter structural requirements metrics necessary before beginning operations..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Right Column Layout Configurations Meta Blocks Settings container widgets frame panel */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
          {/* Internal Access Rules Level Visibility Parameters Dropdown Trigger Fields */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Course Visibility</label>
            <div className="flex gap-4">
              {['Everyone', 'Organization Members Only', 'Specific Users'].map(opt => (
                <label key={opt} className="flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                  <input type="radio" name="visOption" defaultChecked={opt === 'Everyone'} className="text-blue-600" />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Toggle Switches Panel Matrices Container elements block */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            {[
              { id: 'allowSelfEnroll', label: 'Allow learners to self-enroll', desc: 'Enables automatic registration open logic pipeline.' },
              { id: 'requireApproval', label: 'Require approval for enrollment', desc: 'Puts enrollment requests in an admin review queue.' },
              { id: 'enableCertificate', label: 'Enable certificate for this course', desc: 'Awards standardized certification upon completion.' },
              { id: 'downloadableCertificate', label: 'Make certificate downloadable', desc: 'Allows PDF extraction generation frameworks.' },
              { id: 'enableDiscussion', label: 'Discussion & Q&A Board', desc: 'Enables real-time comment and forum sections.' },
              { id: 'enableReviews', label: 'Reviews & Ratings Visibility', desc: 'Allows learners to leave public course feedback.' }
            ].map(toggle => (
              <div key={toggle.id} className="flex items-center justify-between py-1">
                <div className="pr-4">
                  <span className="block text-xs font-semibold text-gray-800">{toggle.label}</span>
                  <span className="block text-[11px] text-gray-400">{toggle.desc}</span>
                </div>
                <button
                  onClick={() => handleToggle(toggle.id)}
                  className={`w-9 h-5 shrink-0 rounded-full transition-colors relative focus:outline-none ${courseData[toggle.id] ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${courseData[toggle.id] ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Interactive Previews Content Drop Selection Menu Block area anchors */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Course Preview</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white">
              <option>Preview first lecture (1.1 Welcome to the Course)</option>
            </select>
          </div>
        </div>

        {/* SEO Management Control Panel Widget box parameters elements code block */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">SEO Settings</h3>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Meta Title</label>
              <span className="text-[10px] text-gray-400">{courseData.metaTitle?.length || 0}/60</span>
            </div>
            <input
              type="text"
              maxLength={60}
              value={courseData.metaTitle}
              onChange={(e) => onUpdate({ metaTitle: e.target.value })}
              placeholder="Enter search engine optimized page title summary meta metric header..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Meta Description</label>
              <span className="text-[10px] text-gray-400">{courseData.metaDescription?.length || 0}/160</span>
            </div>
            <textarea
              maxLength={160}
              rows={2}
              value={courseData.metaDescription}
              onChange={(e) => onUpdate({ metaDescription: e.target.value })}
              placeholder="Enter comprehensive short search listing description indexing contextual parameters..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
            />
          </div>
        </div>
      </div>

      {/* Global Bottom Functional Actions Controls bar implementation element panels */}
      <div className="col-span-1 lg:col-span-2 bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center mt-6">
        <button onClick={onBack} className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-colors">
          ← Back: Pricing
        </button>
        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm">
          Review & Publish Course
        </button>
      </div>
    </div>
  );
}