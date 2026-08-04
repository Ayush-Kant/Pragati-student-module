import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Github, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import {
  formatDate,
  getProjectStatusBadgeColor,
  formatStatusLabel,
} from '../../utils/projectHelpers';
import { MODULE_ROUTES } from '../../constants/projectConstants';

export const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const {
    id,
    title,
    subtitle,
    description,
    status,
    category,
    course,
    dueDate,
    techStack = [],
    teamMembers = [],
    coverImage,
  } = project;

  const handleCardClick = () => {
    navigate(MODULE_ROUTES.PROJECT_DETAILS(id));
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Top Banner Image / Accent Accent */}
      {coverImage && (
        <div className="h-32 -mx-6 -mt-6 mb-4 overflow-hidden relative">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <span
            className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${getProjectStatusBadgeColor(
              status
            )}`}
          >
            {formatStatusLabel(status)}
          </span>
        </div>
      )}

      <div>
        {!coverImage && (
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-700/50 text-indigo-300 border border-slate-600/40">
              {course || category}
            </span>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${getProjectStatusBadgeColor(
                status
              )}`}
            >
              {formatStatusLabel(status)}
            </span>
          </div>
        )}

        <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
          {title}
        </h3>
        <p className="text-xs font-medium text-slate-400 mb-3 line-clamp-1">{subtitle}</p>
        <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed mb-4">{description}</p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {techStack.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700/60"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-900/80 text-slate-400">
              +{techStack.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & Team Avatars */}
      <div className="pt-4 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Due {formatDate(dueDate)}</span>
        </div>

        <div className="flex items-center gap-3">
          {teamMembers.length > 0 && (
            <div className="flex -space-x-2 overflow-hidden">
              {teamMembers.slice(0, 3).map((member, idx) => (
                <img
                  key={member.id || idx}
                  src={member.avatar}
                  alt={member.name}
                  title={member.name}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-800 object-cover"
                />
              ))}
              {teamMembers.length > 3 && (
                <div className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-slate-800 bg-slate-700 text-[10px] font-bold text-white">
                  +{teamMembers.length - 3}
                </div>
              )}
            </div>
          )}

          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
