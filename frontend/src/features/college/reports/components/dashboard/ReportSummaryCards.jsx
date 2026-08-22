import { FileText, Calendar, CloudDownload, Award } from "lucide-react";

export const ReportSummaryCards = ({ statistics, darkMode }) => {
  const cards = [
    {
      id: "total",
      label: "Total Reports",
      value: statistics?.totalReports || 0,
      icon: FileText,
      color: darkMode ? "text-[#ff6d34] bg-[#ff6d34]/10 border-[#ff6d34]/30" : "text-primary bg-orange-50 border-orange-100/50",
      description: "Lifetime reports compiled in the portal database"
    },
    {
      id: "today",
      label: "Generated Today",
      value: statistics?.generatedToday || 0,
      icon: Calendar,
      color: darkMode ? "text-[#ff6d34] bg-[#ff6d34]/10 border-[#ff6d34]/30" : "text-blue-600 bg-blue-50 border-blue-100/50",
      description: "Reports generated during the current operational day"
    },
    {
      id: "downloads",
      label: "Downloaded Reports",
      value: statistics?.downloadedReports || 0,
      icon: CloudDownload,
      color: darkMode ? "text-[#ff6d34] bg-[#ff6d34]/10 border-[#ff6d34]/30" : "text-emerald-600 bg-emerald-50 border-emerald-100/50",
      description: "Documents exported as PDF, CSV, or Excel format"
    },
    {
      id: "system",
      label: "Active Pipelines",
      value: 6,
      icon: Award,
      color: darkMode ? "text-[#ff6d34] bg-[#ff6d34]/10 border-[#ff6d34]/30" : "text-purple-600 bg-purple-50 border-purple-100/50",
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
            className={`rounded-2xl p-5 flex flex-col justify-between transition-all duration-150 ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D] shadow-sm hover:shadow-md' : 'bg-white border border-slate-100 shadow-sm hover:shadow-md'}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{card.label}</span>
              <div className={`p-2.5 rounded-xl border ${card.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className={`text-3xl font-extrabold leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {card.value}
              </h3>
              <p className={`text-[11px] font-semibold leading-relaxed mt-1 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
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
