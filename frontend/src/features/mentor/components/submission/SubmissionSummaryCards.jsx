import {
  Users,
  CheckCircle2,
  Hourglass,
  CircleDashed,
  TriangleAlert,
  TrendingUp,
} from "lucide-react";

const cards = [
  {
    title: "TOTAL",
    value: "124",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    footer: "",
    footerColor: "",
  },
  {
    title: "SUBMITTED",
    value: "85",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    footer: "+12%",
    footerColor: "text-green-600",
  },
  {
    title: "IN PROGRESS",
    value: "28",
    icon: Hourglass,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    footer: "",
    footerColor: "",
  },
  {
    title: "NOT STARTED",
    value: "6",
    icon: CircleDashed,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    footer: "",
    footerColor: "",
  },
  {
    title: "LATE",
    value: "5",
    icon: TriangleAlert,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    footer: "-2%",
    footerColor: "text-red-600",
  },
  {
    title: "AVG COMPLETION",
    value: "74%",
    icon: TrendingUp,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    footer: "",
    footerColor: "",
  },
];

export default function SubmissionSummaryCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-semibold tracking-widest text-slate-500">
                {card.title}
              </p>

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${card.iconBg}`}
              >
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <h2 className="text-3xl font-bold text-slate-900">
                {card.value}
              </h2>

              {card.footer && (
                <span
                  className={`text-sm font-semibold mb-1 ${card.footerColor}`}
                >
                  {card.footer}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}