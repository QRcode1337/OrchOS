import React from 'react';
import { Agent } from '../../types';

interface AgentCardProps {
  /** Agent data to display */
  agent: Agent;
  /** Callback when card body is clicked (opens detail modal) */
  onClick?: () => void;
  /** Callback for status control buttons (play/pause/terminate) */
  onUpdateStatus?: (id: string, status: Agent['status']) => void;
}

/**
 * AgentCard - Displays an individual AI agent with status and controls.
 *
 * Features:
 * - Color-coded header based on agent.color
 * - Status indicator animations (pulse for RUNNING, ping for ERROR)
 * - Progress bar
 * - Play/Pause/Terminate control buttons
 *
 * Wrapped with React.memo to prevent unnecessary re-renders.
 */
const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick, onUpdateStatus }) => {
  const colorClasses = {
    blue: 'gb-blue',
    yellow: 'gb-yellow',
    red: 'gb-red',
    green: 'gb-green',
    purple: 'gb-purple',
    aqua: 'gb-aqua',
    orange: 'gb-orange',
  };

  const borderColor = `border-${colorClasses[agent.color]}`;
  const textColor = `text-${colorClasses[agent.color]}`;
  const bgColor = `bg-${colorClasses[agent.color]}`;

  return (
    <div 
        onClick={onClick}
        className={`flex flex-col group overflow-hidden border-3 border-gb-bg0 bg-gb-bg0/20 relative shadow-sm cursor-pointer transition-transform hover:-translate-y-1`}
    >
      <div className={`h-10 ${bgColor} flex items-center px-4 justify-between border-b-2 border-gb-bg-h`}>
        <span className="text-gb-bg-h font-display font-bold uppercase text-xs tracking-widest">{agent.name}</span>
        <div className="flex gap-1">
            {agent.status === 'RUNNING' && <span className="w-2 h-2 bg-gb-bg-h animate-pulse"></span>}
            {agent.status === 'ERROR' && <span className="w-2 h-2 bg-gb-bg-h animate-ping"></span>}
            <span className="w-2 h-2 bg-gb-bg-h opacity-50"></span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-20 h-20 bg-gb-bg-h border-2 ${borderColor} p-1 pixel-art flex items-center justify-center shrink-0`}>
            <img 
              className={`w-full h-full object-cover grayscale contrast-150 ${agent.color === 'yellow' ? 'sepia hue-rotate-[45deg]' : agent.color === 'red' ? 'sepia-[.8]' : 'sepia-[.5] hue-rotate-[180deg]'}`} 
              src={agent.imageUrl} 
              alt={agent.name}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[10px] font-bold uppercase ${textColor} mb-1`}>Status: {agent.status}</p>
            <p className={`text-xl font-display font-bold uppercase tracking-tighter text-gb-fg italic truncate`}>
                {agent.status === 'RUNNING' ? 'PROCESSING' : agent.status}
            </p>
            <div className={`mt-2 h-2 w-full bg-gb-bg0 border border-gb-gray/20 overflow-hidden`}>
                <div className={`h-full ${bgColor}`} style={{ width: `${agent.progress || 0}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className={`text-xs leading-relaxed text-gb-fg/80 mb-6 font-mono p-3 bg-black/30 border-l-2 ${borderColor}`}>
            "{agent.message}"
        </div>

        <div className="flex justify-between items-center border-t-2 border-gb-bg0 pt-4">
            <span className="text-[9px] font-bold text-gb-gray tracking-widest uppercase truncate max-w-[100px]">{agent.version}</span>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                 {agent.status !== 'RUNNING' ? (
                     <button 
                        onClick={() => onUpdateStatus?.(agent.id, 'RUNNING')}
                        className="w-8 h-8 bg-gb-bg0 flex items-center justify-center hover:bg-gb-green hover:text-gb-bg-h transition-colors border border-gb-gray/20"
                        title="Resume Agent Task"
                     >
                        <span className="material-symbols-outlined text-sm">play_arrow</span>
                     </button>
                 ) : (
                    <button 
                        onClick={() => onUpdateStatus?.(agent.id, 'IDLE')}
                        className="w-8 h-8 bg-gb-bg0 flex items-center justify-center hover:bg-gb-yellow hover:text-gb-bg-h transition-colors border border-gb-gray/20"
                        title="Pause Agent Execution"
                    >
                        <span className="material-symbols-outlined text-sm">pause</span>
                    </button>
                 )}
                 <button 
                    onClick={() => onUpdateStatus?.(agent.id, 'OFFLINE')}
                    className="w-8 h-8 bg-gb-bg0 flex items-center justify-center hover:bg-gb-red hover:text-gb-bg-h transition-colors border border-gb-gray/20"
                    title="Terminate Process"
                 >
                    <span className="material-symbols-outlined text-sm">close</span>
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AgentCard);
