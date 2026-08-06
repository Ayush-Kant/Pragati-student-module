import React from "react";
import { ShieldCheck, Mail } from "lucide-react";

export const ProjectMembers = ({ members = [], mentor }) => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm mb-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-4">
        Project Team & Assigned Mentor
      </h3>

      {/* Mentor Banner */}
      {mentor && (
        <div className="bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-950/40 dark:to-indigo-950/40 border border-brand-200 dark:border-brand-800 rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5 min-w-0">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-400 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h4 className="text-xs font-bold text-surface-900 dark:text-white truncate">{mentor.name}</h4>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-semibold bg-brand-600 text-white rounded-md shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Mentor</span>
                </span>
              </div>
              <p className="text-[11px] text-surface-500 dark:text-surface-400 truncate mt-0.5">{mentor.role}</p>
            </div>
          </div>
          <a
            href={`mailto:${mentor.email}`}
            className="p-2 bg-white dark:bg-surface-800 text-brand-600 dark:text-brand-400 rounded-lg hover:shadow transition-all shrink-0"
            title="Email Mentor"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Team Members Vertical List */}
      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center space-x-3 p-3 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-100 dark:border-surface-700/60"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-surface-300 dark:ring-surface-600 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-surface-900 dark:text-white truncate">{member.name}</span>
                {member.isOwner && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded shrink-0">
                    Lead
                  </span>
                )}
              </div>
              <p className="text-[11px] text-surface-500 dark:text-surface-400 truncate mt-0.5">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectMembers;
