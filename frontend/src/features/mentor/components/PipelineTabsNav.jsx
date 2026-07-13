const tabs = [
  {
    id: "drive-settings",
    label: "Drive Settings",
  },
  {
    id: "hiring-content",
    label: "Hiring Content",
  },
  {
    id: "student-readiness",
    label: "Student Readiness",
  },
  {
    id: "shortlisted",
    label: "Shortlisted",
  },
];

export default function PipelineTabsNav({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="flex gap-3 border-b pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === tab.id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}