import CompanyStatusBadge from "./CompanyStatusBadge";
import { Globe, MapPin, Building2 } from "lucide-react";

export default function CompanyHeader({ company, darkMode = false }) {
  return (
    <div className={`rounded-xl p-6 mb-6 shadow-sm transition ${darkMode ? "bg-slate-950 border border-slate-700" : "bg-white border border-slate-200"}`}>
      <div className="flex items-start gap-4">
        <img
          src={company.logo}
          alt={company.name}
          className="w-24 h-24 rounded-lg object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              {company.name}
            </h1>
            <CompanyStatusBadge status={company.status} darkMode={darkMode} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 size={16} className={darkMode ? "text-slate-400" : "text-slate-500"} />
              <span className={darkMode ? "text-slate-300" : "text-slate-700"}>
                <strong>Industry:</strong>{" "}
                {company.industry}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} className={darkMode ? "text-slate-400" : "text-slate-500"} />
              <span className={darkMode ? "text-slate-300" : "text-slate-700"}>
                <strong>Location:</strong>{" "}
                {company.location}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Globe size={16} className={darkMode ? "text-slate-400" : "text-slate-500"} />
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className={`${darkMode ? "text-sky-400" : "text-blue-500"} hover:underline`}
              >
                {company.website}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}