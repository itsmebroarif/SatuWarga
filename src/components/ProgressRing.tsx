import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 - 100
  size?: number; // default 52
  strokeWidth?: number; // default 5
  color?: string; // e.g. '#0056b3'
  trackColor?: string; // e.g. '#e2e8f0'
  showText?: boolean;
  label?: string;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 52,
  strokeWidth = 5,
  color = '#0056b3',
  trackColor = '#e2e8f0',
  showText = true,
  label,
  className = '',
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90 transition-all duration-700 ease-out">
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle with CSS Transition */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
          <span className="text-[11px] font-black text-slate-900 font-mono">
            {Math.round(normalizedProgress)}%
          </span>
          {label && <span className="text-[7px] text-slate-500 font-bold uppercase mt-0.5">{label}</span>}
        </div>
      )}
    </div>
  );
};
