import React from 'react';
import { Users, Mail, UserCheck } from 'lucide-react';

export const ProjectMembers = ({ members = [], mentor }) => {
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-md">
      <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
        <Users className="w-4 h-4 text-indigo-400" /> Team Members & Faculty
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mentor && (
          <div className="bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/30 p-4 rounded-xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block">
                Project Faculty Mentor
              </span>
              <h4 className="text-sm font-bold text-slate-100">{mentor.name}</h4>
              <p className="text-xs text-slate-400">{mentor.title}</p>
            </div>
          </div>
        )}

        {members.map((member) => (
          <div
            key={member.id}
            className="bg-slate-900/60 border border-slate-700/40 p-4 rounded-xl flex items-center gap-3.5"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-700 shrink-0"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-100">{member.name}</h4>
              <p className="text-xs text-indigo-400 font-medium">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectMembers;
