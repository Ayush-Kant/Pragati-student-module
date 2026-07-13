import React from 'react';

const LiveCertificatePreview = ({ data }) => {
  const { 
    brandColors, 
    organizationName, 
    logoUrl, 
    previewPlaceholders, 
    skillTags, 
    signature 
  } = data;

  return (
    <div 
      className="bg-white shadow-2xl relative overflow-hidden"
      style={{ 
        width: '800px', 
        height: '565px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Decorative Brand Borders */}
      <div 
        className="absolute top-0 left-0 w-4 h-full" 
        style={{ backgroundColor: brandColors.primary }} 
      />
      <div 
        className="absolute top-0 left-0 w-full h-4" 
        style={{ backgroundColor: brandColors.primary }} 
      />
      <div 
        className="absolute bottom-6 right-6 w-32 h-32 border-b-4 border-r-4 opacity-20"
        style={{ borderColor: brandColors.secondary }}
      />

      {/* Content Wrapper */}
      <div className="p-16 pl-20 h-full flex flex-col justify-between relative z-10 text-center">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center gap-4 mt-4">
          {logoUrl ? (
             <img src={logoUrl} alt="Organization Logo" className="h-16 object-contain" />
          ) : (
             <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">Logo</div>
          )}
          <h2 
            className="text-lg font-bold tracking-widest uppercase"
            style={{ color: brandColors.secondary }}
          >
            {organizationName || 'Organization Name'}
          </h2>
        </div>

        {/* Certificate Body */}
        <div className="space-y-6">
          <h1 
            className="text-5xl font-serif text-gray-900"
            style={{ color: brandColors.secondary }}
          >
            CERTIFICATE OF COMPLETION
          </h1>
          <p className="text-gray-500 italic text-lg">This is to certify that</p>
          <h3 
            className="text-4xl font-bold font-serif"
            style={{ color: brandColors.primary }}
          >
            {previewPlaceholders.studentName}
          </h3>
          <p className="text-gray-600 max-w-lg mx-auto">
            has successfully completed the <strong>{previewPlaceholders.programName}</strong> program with an aggregate score of <strong>{previewPlaceholders.score}</strong>.
          </p>
        </div>

        {/* Skills & Footer */}
        <div className="mt-8 flex justify-between items-end">
          
          {/* Skill Tags */}
          <div className="text-left w-1/3">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Acquired Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {skillTags.slice(0, 5).map((skill, i) => (
                <span 
                  key={i} 
                  className="text-[10px] px-2 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-600"
                >
                  {skill}
                </span>
              ))}
              {skillTags.length > 5 && (
                <span className="text-[10px] px-2 py-1 text-gray-400">+{skillTags.length - 5} more</span>
              )}
            </div>
          </div>

          {/* Signature */}
          <div className="flex flex-col items-center w-1/3 border-t-2 border-gray-200 pt-2 relative">
             <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-16 flex items-end justify-center">
               {signature?.url ? (
                 <img src={signature.url} alt="Signature" className="max-h-full max-w-full object-contain" />
               ) : (
                 <span className="text-gray-300 italic text-sm">Signature Placeholder</span>
               )}
             </div>
             <p className="text-sm font-semibold text-gray-800 mt-6">{previewPlaceholders.mentorName}</p>
             <p className="text-xs text-gray-500">Program Mentor</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LiveCertificatePreview;