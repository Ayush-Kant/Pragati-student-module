import React from "react";
import { Award, Calendar, ExternalLink, ShieldCheck } from "lucide-react";
import { formatDate } from "../../utils/studentProfileHelpers";

export const Certifications = ({ certifications = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Certifications</h3>
          <p className="text-xs text-gray-400">Professional credentials and examinations passed</p>
        </div>
      </div>

      <div className="space-y-4">
        {certifications.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">No certifications recorded.</div>
        ) : (
          certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-xl border border-gray-100/60 bg-slate-50/20 hover:bg-slate-50/50 transition-colors flex items-start justify-between gap-4"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 leading-snug">{cert.name}</h4>
                  <p className="text-xs text-gray-500 font-semibold">{cert.issuer}</p>
                  <div className="flex items-center gap-4 text-[10px] text-gray-400 mt-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(cert.date)}
                    </span>
                    {cert.credentialId && (
                      <span>ID: <span className="font-semibold text-gray-600">{cert.credentialId}</span></span>
                    )}
                  </div>
                </div>
              </div>

              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white border border-gray-100 hover:bg-slate-100 hover:text-indigo-600 text-gray-400 transition-all cursor-pointer flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Certifications;
