
import React from 'react';

interface ProgressBarProps {
  progress: number; // A value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-cyan-400">Progress</span>
        <span className="text-sm font-medium text-cyan-400">{Math.round(clampedProgress)}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div
          className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
