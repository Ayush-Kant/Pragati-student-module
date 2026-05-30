import React from "react";

export default function CurriculumOverview({ courseData, modules }) {
  const totalSections = modules.length;
  const totalLectures = modules.reduce(
    (acc, curr) => acc + (curr.lectures?.length || 0),
    0,
  );

  return (
    <div className="space-y-4">
      {/* Metric Breakdown Cards Widget wrapper container */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-3">
          Curriculum Overview
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <span className="block text-xl font-bold text-gray-900">
              {totalSections}
            </span>
            <span className="text-xs text-gray-500">Sections</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <span className="block text-xl font-bold text-gray-900">
              {totalLectures}
            </span>
            <span className="text-xs text-gray-500">Lectures</span>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <span className="block text-md font-bold text-gray-900">
            {courseData.estimatedDuration}
          </span>
          <span className="text-xs text-gray-500">Total Duration</span>
        </div>
      </div>

      {/* Static Tips Layout Informative Frame Block */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 text-xs space-y-3 shadow-sm">
        <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-1.5">
          Course Structure Tips
        </h4>
        <div className="space-y-2 text-gray-600">
          <p className="text-green-600 flex items-start gap-1.5 font-medium">
            <span>✓</span> Create a logical flow of content
          </p>
          <p className="text-green-600 flex items-start gap-1.5 font-medium">
            <span>✓</span> Keep lectures concise and focused
          </p>
          <p className="text-green-600 flex items-start gap-1.5 font-medium">
            <span>✓</span> Use a mix of content types
          </p>
          <p className="text-green-600 flex items-start gap-1.5 font-medium">
            <span>✓</span> Add practice or quiz to reinforce learning
          </p>
        </div>
      </div>
    </div>
  );
}
