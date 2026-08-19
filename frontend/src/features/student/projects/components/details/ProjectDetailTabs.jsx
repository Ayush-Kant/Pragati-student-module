import { DETAIL_TABS } from '../../constants/projectConstants';

/**
 * Tab navigation for the project detail page.
 * @param {{ activeTab: string, onTabChange: Function }} props
 */
const ProjectDetailTabs = ({ activeTab, onTabChange }) => (
  <div
    className="flex overflow-x-auto gap-1 p-1 bg-white/3 rounded-xl border border-white/6 mb-6 scrollbar-thin"
    role="tablist"
    aria-label="Project sections"
  >
    {DETAIL_TABS.map((tab) => (
      <button
        key={tab.id}
        id={`tab-${tab.id}`}
        role="tab"
        aria-selected={activeTab === tab.id}
        aria-controls={`tabpanel-${tab.id}`}
        onClick={() => onTabChange(tab.id)}
        className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
          activeTab === tab.id
            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default ProjectDetailTabs;
