import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Trophy, Medal, ArrowRight } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  isCurrentUser: boolean;
}

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Alex Kumar', score: 485, isCurrentUser: false },
  { rank: 2, name: 'Priya Sharma', score: 472, isCurrentUser: false },
  { rank: 3, name: 'Bhavya', score: 450, isCurrentUser: true },
  { rank: 4, name: 'Rahul Verma', score: 438, isCurrentUser: false },
  { rank: 5, name: 'Sneha Patel', score: 425, isCurrentUser: false },
];

export function LeaderboardPreview() {
  return (
    <div className="flex flex-col gap-4">
      {/* Title & Action Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-slate-800 flex items-center gap-2" style={{ fontWeight: 800, fontSize: '1.25rem' }}>
          <Trophy className="w-5 h-5 text-amber-500" />
          Batch Leaderboard
        </h3>
        <button className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-xs font-bold uppercase tracking-wider">
          View Full <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <Card className="bg-white border border-slate-100 p-5 rounded-2xl hover:border-slate-200/80 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
        <div className="flex flex-col gap-2.5">
          {leaderboard.map((entry) => {
            const isTop3 = entry.rank <= 3;
            return (
              <div
                key={entry.rank}
                className={`p-3.5 rounded-xl flex items-center justify-between transition-all duration-200 ${
                  entry.isCurrentUser
                    ? 'bg-sky-50 border-2 border-sky-200 text-sky-700 shadow-[0_4px_15px_rgba(14,165,233,0.05)] scale-[1.02]'
                    : 'bg-slate-50 border border-slate-100/50 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Rank Badge */}
                  <div
                    className={`w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 ${
                      entry.rank === 1
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : entry.rank === 2
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : entry.rank === 3
                        ? 'bg-orange-50 text-orange-600 border border-orange-200'
                        : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                    style={{ fontWeight: 800, fontSize: '0.8rem' }}
                  >
                    {entry.rank === 1 ? (
                      <Trophy className="w-4 h-4" />
                    ) : entry.rank === 2 || entry.rank === 3 ? (
                      <Medal className="w-4 h-4" />
                    ) : (
                      entry.rank
                    )}
                  </div>

                  {/* User Name */}
                  <span
                    className={`text-sm ${
                      entry.isCurrentUser 
                        ? 'text-sky-600 font-extrabold' 
                        : 'text-slate-700 font-semibold'
                    }`}
                  >
                    {entry.name}
                  </span>
                </div>

                {/* Score badge */}
                <Badge
                  className={`px-3 py-1 font-bold rounded-full text-[10px] uppercase tracking-wider border ${
                    entry.isCurrentUser
                      ? 'bg-sky-600 text-white border-transparent shadow-[0_2px_10px_rgba(14,165,233,0.15)]'
                      : 'bg-white text-slate-500 border-slate-200/80'
                  }`}
                >
                  {entry.score} XP
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
