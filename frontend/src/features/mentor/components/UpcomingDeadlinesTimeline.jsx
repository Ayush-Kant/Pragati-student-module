export default function UpcomingDeadlinesTimeline() {
  const deadlines = [
    {
      label: "TOMORROW",
      title: "HR Management Project",
      subtitle: "Final Sprint Submission",
      color: "red",
    },
    {
      label: "3 DAYS",
      title: "AI Chatbot MVP",
      subtitle: "Intermediate Assessment",
      color: "blue",
    },
    {
      label: "NEXT WEEK",
      title: "Banking App",
      subtitle: "Project Kickoff Phase 2",
      color: "gray",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">
        Upcoming Deadlines
      </h2>

      <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
        {deadlines.map((item) => (
          <div key={item.title} className="relative">
            <span
              className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full border-4
                ${
                  item.color === "red"
                    ? "bg-red-500 border-red-200"
                    : item.color === "blue"
                    ? "bg-[#004ac6] border-blue-200"
                    : "bg-gray-400 border-gray-200"
                }`}
            />

            <div
              className={`rounded-xl p-5
                ${
                  item.color === "red"
                    ? "bg-red-50"
                    : item.color === "blue"
                    ? "bg-blue-50"
                    : "bg-gray-100"
                }`}
            >
              <p
                className={`text-xs font-bold mb-2
                  ${
                    item.color === "red"
                      ? "text-red-600"
                      : item.color === "blue"
                      ? "text-[#004ac6]"
                      : "text-gray-600"
                  }`}
              >
                {item.label}
              </p>

              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="text-gray-500 text-sm">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}