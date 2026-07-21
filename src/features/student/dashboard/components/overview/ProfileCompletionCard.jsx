import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export const ProfileCompletionCard = ({ completionPercentage = 85 }) => {
  const radius = 35;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const items = [
    { id: '1', label: 'Verify Student ID', weight: '+5%', completed: true },
    { id: '2', label: 'Add profile photo', weight: '+10%', completed: true },
    { id: '3', label: 'Link GitHub Account', weight: '+5%', completed: false },
    { id: '4', label: 'Complete Orientation Course', weight: '+10%', completed: false }
  ];

  return (
    <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between pb-4 border-b border-space-border mb-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
          Profile Strength
        </h3>
        <span className="text-[10px] font-semibold text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded-full border border-neon-cyan/20">
          Incomplete
        </span>
      </div>

      <div className="flex items-center justify-center gap-6 py-2">
        {/* SVG Circular Progress Ring */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-slate-800"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-neon-cyan drop-shadow-[0_0_6px_rgba(6,182,212,0.5)] transition-all duration-1000 ease-out"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-white">{completionPercentage}%</span>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Done</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-xs text-gray-300 font-medium leading-relaxed">
            Completing your profile unlocks personalized mentor assistance and updates.
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-neon-gold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Missing 2 details for +15% XP boost</span>
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors duration-200 ${
              item.completed ? 'bg-slate-900/20 text-gray-400' : 'bg-slate-900/50 text-gray-300 border border-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              {item.completed ? (
                <CheckCircle2 className="w-4 h-4 text-neon-emerald" />
              ) : (
                <Circle className="w-4 h-4 text-gray-500" />
              )}
              <span className={item.completed ? 'line-through text-gray-600' : ''}>
                {item.label}
              </span>
            </div>
            <span className={`text-[10px] font-bold ${item.completed ? 'text-gray-600' : 'text-neon-cyan'}`}>
              {item.weight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCompletionCard;
