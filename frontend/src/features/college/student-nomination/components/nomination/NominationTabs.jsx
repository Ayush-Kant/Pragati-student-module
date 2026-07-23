import { useOutletContext } from "react-router-dom";

const NominationTabs = ({
  activeTab,
  setActiveTab,
  eligibleCount,
  nominatedCount,
}) => {
  const { darkMode } = useOutletContext();

  const tabs = [
    {
      id: "eligible",
      label: "Eligible Students",
      count: eligibleCount,
    },
    {
      id: "nominated",
      label: "Nominated Students",
      count: nominatedCount,
    },
  ];

  return (
    <div
      className={`mb-6 flex items-center rounded-2xl border p-1 ${
        darkMode
          ? "border-[#3D3D3D] bg-[#2D2D2D]"
          : "border-slate-200 bg-white"
      }`}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
              active
                ? darkMode ? "bg-[#ff6d34] text-white shadow-lg" : "bg-[#ff7a00] text-white shadow-lg"
                : darkMode
                  ? "text-gray-300 hover:bg-[#3D3D3D]"
                  : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{tab.label}</span>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                active
                  ? "bg-white/20 text-white"
                  : darkMode
                    ? "bg-[#3D3D3D] text-gray-300"
                    : "bg-slate-200 text-slate-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default NominationTabs;