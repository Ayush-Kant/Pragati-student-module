import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ 
  title = 'Something went wrong',
  message = 'Failed to load dashboard resources. Please verify network status or try again.',
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl glass-card border border-red-500/20 text-center w-full min-h-[220px]">
      <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 mb-4 text-neon-coral animate-bounce">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-red-200 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm mb-5">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-red-950/40 hover:bg-red-950/70 text-red-300 border border-red-500/30 transition-all duration-300 transform active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
