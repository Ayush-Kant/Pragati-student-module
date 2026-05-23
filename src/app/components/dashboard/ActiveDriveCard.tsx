import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Briefcase, Calendar } from 'lucide-react';

export function ActiveDriveCard() {
  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-slate-800 flex items-center gap-2" style={{ fontWeight: 800, fontSize: '1.25rem' }}>
        <Briefcase className="w-5 h-5 text-orange-500" />
        Active Recruitment Drive
      </h3>

      <Card className="bg-white border border-slate-100 p-6 rounded-2xl hover:border-slate-200/80 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between h-full min-h-[220px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {/* Title */}
            <h4 className="text-slate-800 text-lg font-black tracking-tight leading-snug">
              Tech Solutions Inc.
            </h4>
            
            {/* Subtitle */}
            <p className="text-sm font-semibold text-slate-500">
              Full Stack Developer Drive 2025
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Badge */}
            <Badge 
              className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full shadow-[0_2px_10px_rgba(16,185,129,0.02)]"
              variant="outline"
            >
              Enrolled
            </Badge>

            {/* Date Details */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>12 Jan 2025 – 30 Mar 2025</span>
            </div>
          </div>
        </div>

        {/* View Button */}
        <div className="mt-6">
          <Button 
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:brightness-110 active:scale-98 text-white font-bold py-2.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(14,165,233,0.15)] border-0 cursor-pointer"
          >
            View Drive Details
          </Button>
        </div>
      </Card>
    </div>
  );
}
