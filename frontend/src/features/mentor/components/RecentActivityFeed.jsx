import {
  CheckCircle2,
  Send,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";

const activities = [
  {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
    title: "UI Review completed",
    subtitle: "Course LMS project update",
    time: "2 hours ago",
  },
  {
    icon: Send,
    color: "text-blue-600",
    bg: "bg-blue-100",
    title: "Sprint 5 submitted",
    subtitle: "Banking App Beta students",
    time: "4 hours ago",
  },
  {
    icon: AlertTriangle,
    color: "text-orange-500",
    bg: "bg-orange-100",
    title: "Backend review pending",
    subtitle: "HR Management blocker",
    time: "Yesterday",
  },
  {
    icon: MessageCircle,
    color: "text-[#004ac6]",
    bg: "bg-blue-100",
    title: "Mentor feedback added",
    subtitle: "AI Chatbot Project",
    time: "Yesterday",
  },
];

export default function RecentActivityFeed() {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Recent Activity
        </h2>

        <button className="text-[#004ac6] text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-5">
        {activities.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex gap-4 items-start"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg}`}
              >
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm">
                  {item.subtitle}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}