
import React from 'react';
import { PartyPopper } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  target: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, className = "" }) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const isCompleted = current >= target;

  return (
    <div className={`w-full space-y-2 ${className}`}>
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</span>
        <span className="text-sm font-bold text-[#A020F0]">{percentage}%</span>
      </div>
      
      <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-[#DFFF00] to-[#A020F0] transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isCompleted && (
        <div className="flex items-center gap-1.5 mt-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full w-fit animate-bounce border border-emerald-100">
          <PartyPopper size={14} />
          <span className="text-[10px] font-extrabold uppercase tracking-tight">Goal Reached!</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
