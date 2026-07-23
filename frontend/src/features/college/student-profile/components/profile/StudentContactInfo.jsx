import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export const StudentContactInfo = ({ student, darkMode }) => {
  const safeStudent = student || {};
  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <h3 className={`text-sm font-bold mb-4 pb-2 border-b ${darkMode ? 'text-white border-[#3D3D3D]' : 'text-gray-800 border-gray-50'}`}>Contact & Socials</h3>
      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D] text-gray-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
            <Mail className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</span>
            {safeStudent.email ? (
              <a
                href={`mailto:${safeStudent.email}`}
                className="text-sm font-semibold text-[#ff6d34] hover:underline"
              >
                {safeStudent.email}
              </a>
            ) : (
              <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>—</span>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D] text-gray-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
            <Phone className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Phone Number</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{safeStudent.phone || "—"}</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border mt-0.5 ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D] text-gray-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Address</span>
            <span className={`text-sm font-semibold leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {safeStudent.address || "—"}
            </span>
          </div>
        </div>

        {/* Social Links */}
        <div className={`pt-2 border-t flex items-center gap-4 ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-50'}`}>
          {safeStudent.linkedin && (
            <a
              href={safeStudent.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                darkMode
                  ? 'bg-[#1A1A1A] border-[#3D3D3D] text-gray-400 hover:bg-[#3D3D3D] hover:text-[#ff6d34] hover:border-[#ff6d34]'
                  : 'bg-slate-50 border-slate-100 hover:bg-orange-50/50 hover:text-[#ff6d34] hover:border-orange-100 text-gray-500'
              }`}
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                darkMode
                  ? 'bg-[#1A1A1A] border-[#3D3D3D] text-gray-400 hover:bg-[#3D3D3D] hover:text-white hover:border-gray-500'
                  : 'bg-slate-50 border-slate-100 hover:bg-slate-900/5 hover:text-slate-900 hover:border-slate-300 text-gray-500'
              }`}
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
