import {
    Users,
    TrendingUp,
    Activity,
    BookOpen,
} from "lucide-react";

const AnalyticsPanel = ({ analytics }) => {
    const cards = [
        {
            id: 1,
            label: "Enrollment",
            value: analytics?.enrollment ?? 0,
            icon: Users,
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
            borderColor: "border-blue-300",
        },
        {
            id: 2,
            label: "Completion Rate",
            value: analytics?.completionRate ?? "0%",
            icon: TrendingUp,
            bgColor: "bg-green-100",
            textColor: "text-green-600",
            borderColor: "border-green-300",
        },
        {
            id: 3,
            label: "Avg Engagement",
            value:
                analytics?.avgEngagementLoginsPerWeek ?? 0,
            icon: Activity,
            bgColor: "bg-purple-100",
            textColor: "text-purple-600",
            borderColor: "border-purple-300",
        },
        {
            id: 4,
            label: "Modules Completed",
            value: analytics?.modulesCompleted ?? 0,
            icon: BookOpen,
            bgColor: "bg-orange-100",
            textColor: "text-orange-600",
            borderColor: "border-orange-300",
        },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
                Analytics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className={`
              ${card.bgColor}
              ${card.borderColor}
              border
              rounded-2xl
              p-5
              shadow-sm
              hover:shadow-md
              transition-all
              duration-300
            `}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <h3
                                className={`text-3xl font-bold ${card.textColor}`}
                            >
                                {card.value}
                            </h3>

                            <div className={card.textColor}>
                                <card.icon size={30} />
                            </div>
                        </div>

                        <p className="text-sm font-medium text-gray-700">
                            {card.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsPanel;