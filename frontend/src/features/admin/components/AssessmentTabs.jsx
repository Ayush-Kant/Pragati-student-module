const AssessmentTabs = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    "MCQ Tests",
    "Coding Tests",
    "Archives",
  ];

  return (
    <div className="flex gap-3 mt-4 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-2 rounded-lg font-medium transition
            ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default AssessmentTabs;