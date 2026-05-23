import { ClipboardList, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';

interface Task {
  id: string;
  title: string;
  type: string; // "Pending Assignment" or "Scheduled Quiz"
  timeLeft: string;
  badgeBgClass: string;
  badgeTextClass: string;
  badgeBorderClass: string;
}

const tasks: Task[] = [
  {
    id: '1',
    title: 'Build a REST API with Express',
    type: 'Pending Assignment',
    timeLeft: '4d 23h left',
    badgeBgClass: 'bg-cyan-50',
    badgeTextClass: 'text-cyan-600',
    badgeBorderClass: 'border-cyan-100',
  },
  {
    id: '2',
    title: 'React Hooks Assessment',
    type: 'Scheduled Quiz',
    timeLeft: '1d 23h left',
    badgeBgClass: 'bg-purple-50',
    badgeTextClass: 'text-purple-600',
    badgeBorderClass: 'border-purple-100',
  },
];

export function PendingTasksList() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header with Title & View All */}
      <div className="flex items-center justify-between">
        <h3 className="text-slate-800 flex items-center gap-2" style={{ fontWeight: 800, fontSize: '1.25rem' }}>
          <ClipboardList className="w-5 h-5 text-purple-500" />
          Pending Tasks
        </h3>
        <button className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-xs font-bold uppercase tracking-wider">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tasks Stack */}
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <Card 
            key={task.id} 
            className="bg-white border border-slate-100 p-5 rounded-2xl hover:border-slate-200/80 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col gap-3.5"
          >
            {/* Top Category Badge */}
            <div className="flex">
              <span className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full border ${task.badgeBgClass} ${task.badgeTextClass} ${task.badgeBorderClass}`}>
                {task.type}
              </span>
            </div>

            {/* Task Title */}
            <h4 className="text-slate-800 text-base font-extrabold tracking-tight leading-snug">
              {task.title}
            </h4>

            {/* Bottom Row: Remaining Time & Start Button */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1.5">
              <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-100 text-sky-600 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_2px_10px_rgba(14,165,233,0.01)]">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                {task.timeLeft}
              </div>
              
              <button className="text-xs font-black text-slate-500 hover:text-slate-800 transition-all cursor-pointer flex items-center gap-1 uppercase tracking-widest hover:translate-x-0.5 duration-200">
                Start
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
