import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export const StudentContactInfo = ({ student }) => {
  const safeStudent = student || {};
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50">Contact & Socials</h3>
      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-500">
            <Mail className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</span>
            {safeStudent.email ? (
              <a
                href={`mailto:${safeStudent.email}`}
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                {safeStudent.email}
              </a>
            ) : (
              <span className="text-sm font-semibold text-gray-700">—</span>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-500">
            <Phone className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Phone Number</span>
            <span className="text-sm font-semibold text-gray-700">{safeStudent.phone || "—"}</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-500 mt-0.5">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Address</span>
            <span className="text-sm font-semibold text-gray-700 leading-relaxed">
              {safeStudent.address || "—"}
            </span>
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-2 border-t border-gray-50 flex items-center gap-4">
          {safeStudent.linkedin && (
            <a
              href={safeStudent.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-indigo-50/50 hover:text-indigo-600 hover:border-indigo-100 text-xs font-semibold text-gray-500 transition-all duration-200"
            >
              <FaLinkedin className="w-4 h-4 text-blue-600" />
              LinkedIn
            </a>
          )}
          {safeStudent.github && (
            <a
              href={safeStudent.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-900/5 hover:text-slate-900 hover:border-slate-300 text-xs font-semibold text-gray-500 transition-all duration-200"
            >
              <FaGithub className="w-4 h-4 text-gray-800" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentContactInfo;
