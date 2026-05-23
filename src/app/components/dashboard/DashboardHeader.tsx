import { useEffect, useState } from 'react';

export function DashboardHeader() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  return (
    <div className="mb-8 flex flex-col gap-6">
      {/* Date Header */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Student Workspace
        </span>
        <span className="text-sm font-semibold text-slate-400">
          {currentDate}
        </span>
      </div>

      {/* Greeting Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-white via-slate-50 to-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between group">
        {/* Left Content */}
        <div className="flex flex-col gap-4.5 z-10">
          <h1 className="text-slate-800 tracking-tight flex items-center gap-2.5 font-black text-2.5xl lg:text-3.5xl">
            Good morning, Alex! <span className="animate-bounce inline-block">👋</span>
          </h1>
          
          {/* Placement / Campaign Badge */}
          <div className="flex items-center gap-2.5 bg-slate-100/80 border border-cyan-200/60 pl-1.5 pr-4 py-1.5 rounded-full w-fit shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
            <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-200 flex items-center justify-center text-cyan-600 font-bold text-xs shadow-inner">
              T
            </div>
            <span className="text-xs lg:text-sm font-extrabold text-slate-600 tracking-wide">
              TechCorp Recruitment Drive 2026
            </span>
          </div>
        </div>

        {/* Right SVG Graphic (Owl drawing) */}
        <div className="relative shrink-0 pr-2 lg:pr-6 z-10 transition-transform duration-500 group-hover:scale-105">
          <svg 
            viewBox="0 0 100 100" 
            className="w-20 h-20 lg:w-24 lg:h-24 text-slate-400/30 fill-current filter drop-shadow-[0_0_8px_rgba(0,0,0,0.01)]"
          >
            {/* Owl Ears / Tufts */}
            <path d="M 22 26 L 33 13 L 45 23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 78 26 L 67 13 L 55 23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Owl Body */}
            <rect x="20" y="23" width="60" height="64" rx="30" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            
            {/* Owl Eyes Circles */}
            <circle cx="37" cy="45" r="11" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="37" cy="45" r="3.5" fill="currentColor" />
            <circle cx="63" cy="45" r="11" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="63" cy="45" r="3.5" fill="currentColor" />
            
            {/* Owl Beak */}
            <polygon points="50,51 45,58 55,58" stroke="currentColor" strokeWidth="1" />
            
            {/* Cute Belly Feathers */}
            <path d="M 40 68 Q 50 72 60 68" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 43 74 Q 50 78 57 74" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Cute Owl Wings Outline */}
            <path d="M 20 40 Q 14 55 20 70" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M 80 40 Q 86 55 80 70" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Glowing Background Orbs */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-500/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-orange-500/8 rounded-full blur-3xl pointer-events-none"></div>
      </section>
    </div>
  );
}
