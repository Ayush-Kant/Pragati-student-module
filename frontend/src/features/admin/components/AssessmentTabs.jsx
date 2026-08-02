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
    <div className="mt-4 mb-6 flex flex-wrap gap-2 md:gap-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`rounded-lg px-3 py-2 md:px-5 md:py-2 text-sm md:text-base font-medium transition whitespace-nowrap ${
            activeTab === tab
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default AssessmentTabs;