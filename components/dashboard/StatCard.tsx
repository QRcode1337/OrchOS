import React from 'react';

interface StatCardProps {
  /** Card title displayed in header (e.g., "Total Tokens") */
  title: string;
  /** Material Symbols icon name */
  icon: string;
  /** Main value to display prominently */
  value: string;
  /** Secondary text below the value */
  subValue: string;
  /** Tailwind color class for subValue (e.g., 'text-gb-green') */
  subValueColor: string;
  /** Theme color for border accent and progress bar */
  color: 'blue' | 'yellow' | 'red';
  /** Progress bar percentage (0-100) */
  progress: number;
}

/**
 * StatCard - Displays a metric with progress bar and status text.
 *
 * Features:
 * - Color-coded left border accent
 * - Material Symbols icon
 * - Progress bar with retro grid overlay
 *
 * Wrapped with React.memo to prevent unnecessary re-renders.
 */
const StatCard: React.FC<StatCardProps> = ({ title, icon, value, subValue, subValueColor, color, progress }) => {
  const colorMap = {
    blue: { border: 'border-l-gb-blue', text: 'text-gb-blue', bg: 'bg-gb-blue' },
    yellow: { border: 'border-l-gb-yellow', text: 'text-gb-yellow', bg: 'bg-gb-yellow' },
    red: { border: 'border-l-gb-red', text: 'text-gb-red', bg: 'bg-gb-red' },
  };

  const c = colorMap[color];

  return (
    <div className={`p-6 border-3 border-gb-bg0 bg-gb-bg0/40 relative shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] border-l-8 ${c.border}`}>
      <div className="flex justify-between items-start mb-4">
        <p className={`text-[10px] font-bold uppercase ${c.text} tracking-widest`}>{title}</p>
        <span className={`material-symbols-outlined ${c.text} text-sm`}>{icon}</span>
      </div>
      <p className="text-4xl font-display font-bold uppercase tracking-tighter text-gb-fg">{value}</p>
      <div className="mt-4 h-4 w-full bg-gb-bg-h border-2 border-gb-bg0 relative overflow-hidden">
        <div className={`h-full ${c.bg} transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
        {/* Grid Overlay for Retro Effect */}
        <div className="absolute inset-0 grid grid-cols-10 h-full w-full pointer-events-none">
             {[...Array(10)].map((_, i) => (
                 <div key={i} className="border-r border-gb-bg-h/50 h-full"></div>
             ))}
        </div>
      </div>
      <p className={`mt-2 text-[10px] ${subValueColor} font-bold`}>{subValue}</p>
    </div>
  );
};

export default React.memo(StatCard);
