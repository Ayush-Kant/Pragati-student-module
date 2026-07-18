import React from 'react';

export const LoadingSpinner = ({ message = 'Loading dashboard content...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[250px] w-full p-8 rounded-2xl glass-card relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute w-40 h-40 rounded-full bg-neon-violet/10 blur-3xl animate-pulse-slow"></div>
      
      {/* Outer ring */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-space-border"></div>
        {/* Animated spinner ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-neon-violet border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        {/* Inner pulsing core */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-neon-indigo to-neon-violet opacity-80 animate-ping"></div>
      </div>
      
      <p className="mt-6 text-sm font-medium tracking-wide text-gray-400 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
