import React from "react";
import { Award } from "lucide-react";

export const CGPACard = ({ cgpa = 0.0, semestersCompleted = 0, darkMode }) => {
  const normalizedCGPA = Math.min(Math.max(cgpa, 0), 10);
  const percentage = (normalizedCGPA / 10) * 100;
  
  // SVG Circle Calculations
  const radius = 38;
  const strokeWidth = 6.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between gap-4 ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="space-y-2">
        <div className={`flex items-center gap-2 ${darkMode ? 'text-[#ff6d34]' : 'text-indigo-600'}`}>
          <Award className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Overall Standing</span>
        </div>
        <h3 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cumulative GPA</h3>
        <p className="text-xs text-gray-400">
          Calculated across {semestersCompleted} completed semesters.
        </p>
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={darkMode ? "#3D3D3D" : "#F3F4F6"}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Foreground circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="url(#cgpaGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="cgpaGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff6d34" />
              <stop offset="100%" stopColor="#00bea3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating text */}
        <div className="absolute text-center">
          <span className={`block text-xl font-black leading-tight ${darkMode ? 'text-[#ff6d34]' : 'text-indigo-600'}`}>
            {normalizedCGPA.toFixed(2)}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">out of 10</span>
        </div>
      </div>
    </div>
  );
};

export default CGPACard;
