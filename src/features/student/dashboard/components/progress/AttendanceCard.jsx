import React from 'react';
import { CalendarDays, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export const AttendanceCard = ({ attendanceData = {} }) => {
  const rate = attendanceData.rate || 0;
  const present = attendanceData.present || 0;
  const absent = attendanceData.absent || 0;
  const excused = attendanceData.excused || 0;
  const total = attendanceData.totalClasses || (present + absent + excused);
  const history = attendanceData.history || [];

  return (
    <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between pb-4 border-b border-space-border mb-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-neon-emerald" /> Attendance System
        </h3>
        <span className="text-[10px] font-bold text-neon-emerald bg-neon-emerald/10 px-2 py-0.5 rounded-full border border-neon-emerald/20">
          Good standing
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-4">
        <div className="bg-slate-900/30 p-2.5 rounded-lg border border-white/5 flex flex-col items-center">
          <CheckCircle className="w-4 h-4 text-neon-emerald mb-1" />
          <span className="text-sm font-extrabold text-gray-100">{present}</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase">Present</span>
        </div>
        <div className="bg-slate-900/30 p-2.5 rounded-lg border border-white/5 flex flex-col items-center">
          <AlertCircle className="w-4 h-4 text-neon-coral mb-1" />
          <span className="text-sm font-extrabold text-gray-100">{absent}</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase">Absent</span>
        </div>
        <div className="bg-slate-900/30 p-2.5 rounded-lg border border-white/5 flex flex-col items-center">
          <AlertTriangle className="w-4 h-4 text-neon-gold mb-1" />
          <span className="text-sm font-extrabold text-gray-100">{excused}</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase">Excused</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center text-xs text-gray-400 mb-1.5 font-semibold">
            <span>Overall Attended Rate</span>
            <span className="text-white font-extrabold">{rate}% ({present}/{total})</span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-px border border-white/5">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                rate >= 90 ? 'bg-neon-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-neon-gold shadow-[0_0_8px_rgba(245,158,11,0.5)]'
              }`}
              style={{ width: `${rate}%` }}
            ></div>
          </div>
        </div>

        {/* History Sparkline bar chart */}
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Monthly History Breakdown
          </span>
          <div className="flex items-center gap-4 bg-slate-950/20 p-2 rounded-xl border border-white/5 justify-around">
            {history.map((h, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-[9px] text-gray-400 font-bold mb-1">{h.rate}%</span>
                <div className="w-3.5 h-10 bg-slate-900 rounded overflow-hidden flex items-end border border-white/5">
                  <div 
                    className="w-full bg-neon-emerald/70 hover:bg-neon-emerald transition-all duration-300" 
                    style={{ height: `${h.rate}%` }}
                  ></div>
                </div>
                <span className="text-[9px] font-bold text-gray-500 mt-1">{h.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
