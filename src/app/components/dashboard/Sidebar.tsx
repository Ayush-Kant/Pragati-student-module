import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  Tv, 
  FolderGit2, 
  BarChart3, 
  Users, 
  Menu
} from 'lucide-react';

interface SidebarProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({ currentTab = 'Dashboard', onTabChange }: SidebarProps) {
  const learningItems = [
    { name: 'Dashboard', icon: LayoutDashboard, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-400' },
    { name: 'My Courses', icon: BookOpen, color: 'text-orange-400' },
    { name: 'Assignments', icon: ClipboardList, color: 'text-cyan-400' },
    { name: 'Sessions', icon: Tv, color: 'text-purple-400' },
    { name: 'Projects', icon: FolderGit2, color: 'text-emerald-400' },
  ];

  const careerItems = [
    { name: 'Performance', icon: BarChart3, color: 'text-amber-400' },
    { name: 'Interviews', icon: Users, color: 'text-slate-400' },
  ];

  return (
    <aside className="w-64 bg-[#090B11] border-r border-[#1E293B] flex flex-col h-screen sticky top-0 text-slate-300">
      {/* Top Menu / Branding Header */}
      <div className="p-5 flex flex-col gap-4 border-b border-[#1E293B]/50">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1E293B] bg-[#111827]/50 hover:bg-[#1E293B] transition-colors w-fit text-sm font-medium text-slate-200">
          <Menu className="w-4 h-4 text-slate-400" />
          <span>Menu</span>
        </button>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-1 text-2xl font-bold tracking-tight">
            <span className="text-white">Upto</span>
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Skills</span>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
            Let's make freshers employable
          </span>
        </div>
      </div>

      {/* Nav Content */}
      <div className="flex-1 py-6 px-4 flex flex-col gap-7 overflow-y-auto scrollbar-thin">
        {/* Learning Section */}
        <div className="flex flex-col gap-2">
          <span className="px-3 text-[11px] font-bold text-slate-500 tracking-widest uppercase">
            Learning
          </span>
          <div className="flex flex-col gap-1.5 mt-1">
            {learningItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.name === currentTab;
              return (
                <button
                  key={item.name}
                  onClick={() => onTabChange?.(item.name)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-sky-500/10 border-l-4 border-sky-400 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]' 
                      : 'hover:bg-slate-800/40 hover:text-white border-l-4 border-transparent text-slate-400'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-sky-400' : item.color}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Career Section */}
        <div className="flex flex-col gap-2">
          <span className="px-3 text-[11px] font-bold text-slate-500 tracking-widest uppercase">
            Career
          </span>
          <div className="flex flex-col gap-1.5 mt-1">
            {careerItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.name === currentTab;
              return (
                <button
                  key={item.name}
                  onClick={() => onTabChange?.(item.name)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-sky-500/10 border-l-4 border-sky-400 text-sky-400' 
                      : 'hover:bg-slate-800/40 hover:text-white border-l-4 border-transparent text-slate-400'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-sky-400' : item.color}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#1E293B]/80 bg-[#06080E]/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(14,165,233,0.2)]">
          AK
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-white truncate">Alex Kumar</span>
          <span className="text-xs text-slate-500 font-medium truncate">Student</span>
        </div>
      </div>
    </aside>
  );
}
