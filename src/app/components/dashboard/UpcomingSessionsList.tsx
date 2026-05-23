import { Calendar, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';

interface Session {
  id: string;
  title: string;
  mentor: string;
  mentorInitials: string;
  timeLeft: string;
  status: string;
}

const sessions: Session[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    mentor: 'Dr. Sarah Johnson',
    mentorInitials: 'DJ',
    timeLeft: '1h 54m left',
    status: 'Scheduled',
  },
  {
    id: '2',
    title: 'System Design Fundamentals',
    mentor: 'Prof. Raj Kumar',
    mentorInitials: 'PK',
    timeLeft: '23h 54m left',
    status: 'Scheduled',
  },
];

export function UpcomingSessionsList() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header with Title & View All */}
      <div className="flex items-center justify-between">
        <h3 className="text-slate-800 flex items-center gap-2" style={{ fontWeight: 800, fontSize: '1.25rem' }}>
          <Calendar className="w-5 h-5 text-sky-500" />
          Upcoming Sessions
        </h3>
        <button className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-xs font-bold uppercase tracking-wider">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sessions Grid/Stack */}
      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <Card 
            key={session.id} 
            className="bg-white border border-slate-100 p-5 rounded-2xl hover:border-slate-200/80 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col gap-4"
          >
            {/* Top Row: Title & Scheduled Status */}
            <div className="flex items-start justify-between gap-4">
              <h4 className="text-slate-800 text-base font-extrabold tracking-tight leading-snug max-w-[70%]">
                {session.title}
              </h4>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200/60 px-3 py-1 rounded-full">
                {session.status}
              </span>
            </div>

            {/* Mentor Info: Initial Avatar + Name */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 font-extrabold text-[10px] shadow-inner">
                {session.mentorInitials}
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {session.mentor}
              </span>
            </div>

            {/* Bottom Row: Time Remaining & Join Action */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
              <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-100 text-yellow-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_2px_10px_rgba(234,179,8,0.01)]">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                {session.timeLeft}
              </div>
              
              <button className="text-xs font-black text-slate-500 hover:text-slate-800 transition-all cursor-pointer flex items-center gap-1 uppercase tracking-widest hover:translate-x-0.5 duration-200">
                Join Session
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
