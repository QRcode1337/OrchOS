import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label }) => {
  const sizeClasses = {
    sm: 'w-3 h-3 border',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-2',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} border-gb-gray border-t-gb-aqua rounded-full animate-spin`}
      />
      {label && (
        <span className="text-[10px] font-mono text-gb-gray uppercase tracking-widest animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};

export default Spinner;
