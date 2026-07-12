import React from "react";
import { FileText, Calendar, CloudDownload, Award } from "lucide-react";

export const ReportSummaryCards = ({ statistics }) => {
  const cards = [
    {
      id: "total",
      label: "Total Reports",
      value: statistics?.totalReports || 0,
      icon: FileText,
      color: "text-primary bg-orange-50 border-orange-100/50",
      description: "Lifetime reports compiled in the portal database"
    },
    {
      id: "today",
      label: "Generated Today",
      value: statistics?.generatedToday || 0,
      icon: Calendar,
      color: "text-blue-600 bg-blue-50 border-blue-100/50",
      description: "Reports generated during the current operational day"
    },
    {
      id: "downloads",
      label: "Downloaded Reports",
      value: statistics?.downloadedReports || 0,
      icon: CloudDownload,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100/50",
      description: "Documents exported as PDF, CSV, or Excel format"
    },
    {
      id: "system",
      label: "Active Pipelines",
      value: 6,
      icon: Award,
      color: "text-purple-600 bg-purple-50 border-purple-100/50",
      description: "Total automated report templates connected"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</span>
              <div className={`p-2.5 rounded-xl border ${card.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold text-slate-800 leading-tight">
                {card.value}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 leading-relaxed mt-1">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportSummaryCards;
