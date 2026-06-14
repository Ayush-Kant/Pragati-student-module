import React from "react";
import { resumeData } from "../../types/profileDummyData";

const ResumePreview = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-start justify-center py-12 px-4">
      {/* Main Card */}
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-[#f4f8ff] flex items-center justify-center text-2xl shadow-sm">
            👀
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Preview</h1>

            <p className="text-sm text-gray-500 mt-1">View uploaded resume</p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl py-10 px-5 flex flex-col items-center text-center shadow-inner">
          {/* Resume Icon Box */}
          <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-5xl mb-4 border border-gray-100">
            📄
          </div>

          {/* File Name */}
          <h2 className="text-xl font-semibold text-gray-800">
            {resumeData.filename}
          </h2>

          {/* Uploaded Date */}
          <p className="text-sm text-gray-500 mt-2">
            Uploaded in {resumeData.uploadedAt}
          </p>

          {/* Button */}
          <button className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg">
            Open Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
