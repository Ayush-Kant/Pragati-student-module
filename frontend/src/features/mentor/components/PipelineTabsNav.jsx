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
    <div
  className="
    sticky
    top-0
    z-20
    bg-white
    border-b
    pb-3
    pt-2
    flex
    gap-3
  "
>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === tab.id
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200 hover:shadow-sm"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}