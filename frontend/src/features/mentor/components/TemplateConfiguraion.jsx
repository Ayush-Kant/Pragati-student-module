import React from 'react';

const TemplateConfiguration = ({ templateData }) => {
  return (
    <div className="space-y-8 pb-20 relative min-h-full">
      
      {/* Dev A's Target: Logo Upload Component */}
      <section>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Organization Logo
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center gap-2">
           {/* Dev A will put the Dropzone here */}
           <div className="text-gray-500 text-sm font-medium">Click to upload or drag & drop</div>
           <div className="text-gray-400 text-xs">SVG, PNG, JPG (max. 2MB)</div>
        </div>
      </section>

      {/* Dev A's Target: Brand Color Pickers */}
      <section>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Brand Colors
        </label>
        <div className="flex gap-4">
          <div className="flex-1">
             <span className="text-xs text-gray-500 mb-1 block">Primary Color</span>
             <div className="h-10 w-full border border-gray-200 rounded-lg flex items-center p-1 gap-2">
               <div className="w-8 h-8 rounded-md" style={{ backgroundColor: templateData.brandColors.primary }}></div>
               <span className="text-sm text-gray-700 font-medium">{templateData.brandColors.primary}</span>
             </div>
          </div>
          <div className="flex-1">
             <span className="text-xs text-gray-500 mb-1 block">Secondary Color</span>
             <div className="h-10 w-full border border-gray-200 rounded-lg flex items-center p-1 gap-2">
               <div className="w-8 h-8 rounded-md" style={{ backgroundColor: templateData.brandColors.secondary }}></div>
               <span className="text-sm text-gray-700 font-medium">{templateData.brandColors.secondary}</span>
             </div>
          </div>
        </div>
      </section>

      {/* Dev A's Target: Mentor Signature Manager */}
      <section>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Mentor Signature
        </label>
        <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs">IMG</div>
              <div>
                <p className="text-sm font-medium text-gray-900">{templateData.signature.fileName}</p>
                <p className="text-xs text-gray-500">{templateData.signature.size}</p>
              </div>
           </div>
        </div>
        <button className="text-blue-600 text-sm font-medium mt-2 hover:underline">
          + Replace Signature
        </button>
      </section>

      {/* Dev A's Target: Skill Tag Input */}
      <section>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Acquired Skills
        </label>
        <div className="border border-gray-200 rounded-xl p-3 min-h-[100px] flex flex-wrap content-start gap-2">
          {templateData.skillTags.map(skill => (
            <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1 border border-blue-100">
              {skill} <span className="cursor-pointer hover:text-blue-900">&times;</span>
            </span>
          ))}
          <input 
            type="text" 
            placeholder="Add another skill..." 
            className="outline-none text-sm flex-1 min-w-[120px] bg-transparent mt-1 ml-1"
            disabled
          />
        </div>
      </section>

      {/* Fixed Save Button */}
      <div className="absolute bottom-0 left-0 w-full pt-4 bg-white border-t border-gray-100">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2">
          Save Template
        </button>
      </div>
    </div>
  );
};

export default TemplateConfiguration;