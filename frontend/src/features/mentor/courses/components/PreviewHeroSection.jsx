import React from 'react';

const PreviewHeroSection = ({ data }) => {
  if (!data) return null;
  return (
    <div className="bg-slate-900 text-white p-8 rounded-lg shadow-md mb-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            <span className="bg-indigo-600 text-xs px-2 py-1 rounded-md capitalize">{data.category}</span>
            <span className="bg-slate-700 text-xs px-2 py-1 rounded-md capitalize">{data.level}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
          <p className="text-slate-300 mb-6">{data.shortDescription}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-200">Language:</span> {data.language}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-200">Duration:</span> {data.estimatedDuration}
            </div>
          </div>
        </div>
        <div className="md:w-72 bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center">
          <div className="text-3xl font-bold text-white mb-2">
            {data.currency} {data.basePrice}
          </div>
          {data.pricingModel === 'Paid' && (
             <div className="text-sm text-slate-400 mb-4">{data.pricingModel} Course</div>
          )}
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition-colors">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewHeroSection;
