import React from 'react';
import { FileText } from 'lucide-react';

export const ProjectDescription = ({ description }) => {
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-md">
      <h3 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-indigo-400" /> Problem Statement & Description
      </h3>
      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
        {description}
      </p>
    </div>
  );
};

export default ProjectDescription;
