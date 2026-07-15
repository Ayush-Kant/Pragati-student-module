import React from "react";
import { ExternalLink, Code } from "lucide-react";

export const ProjectsCard = ({ projects = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">Academic & Personal Projects</h3>
        <p className="text-xs text-gray-400">Applications built, tech stack utilized, and code bases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-2 text-center py-6 text-sm text-gray-400">No project listings found.</div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-xl border border-gray-100 bg-slate-50/10 hover:bg-slate-50/30 flex flex-col justify-between gap-4 transition-all duration-200"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="text-sm font-extrabold text-gray-800 leading-snug">{proj.title}</h4>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-gray-100 bg-white text-gray-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium mb-3">
                  {proj.description}
                </p>
              </div>

              {/* Tech Stack tags */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-50">
                {proj.techStack &&
                  proj.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50/50 border border-indigo-100/30 text-[10px] font-bold text-indigo-600"
                    >
                      <Code className="w-2.5 h-2.5" />
                      {tech}
                    </span>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsCard;
