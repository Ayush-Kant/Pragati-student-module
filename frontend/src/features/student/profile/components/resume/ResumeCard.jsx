import React from "react";
import { resumeData } from "../../types/profileDummyData";

const ResumeCard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 p-6">
          <div className="flex items-center justify-between">
            {/* LEFT SECTION */}
            <div className="flex items-center gap-5">
              {/* FILE ICON */}
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                <span className="text-3xl">📄</span>
              </div>

              {/* TEXT */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Uploaded Resume
                </h2>

                <p className="text-[15px] text-gray-700 mt-1 font-medium">
                  {resumeData.filename}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Uploaded in {resumeData.uploadedAt}
                </p>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-3">
              {/* STATUS */}
              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                Active
              </div>

              {/* VIEW BUTTON */}
              <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition">
                View
              </button>

              {/* REPLACE BUTTON */}
              <button className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-medium transition">
                Replace
              </button>

              {/* DELETE BUTTON */}
              <button className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
