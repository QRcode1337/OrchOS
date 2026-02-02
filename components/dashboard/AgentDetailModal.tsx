import React from 'react';
import { Agent, LogEntry } from '../../types';
import Modal from '../shared/Modal';

interface AgentDetailModalProps {
  agent: Agent | null;
  logs: LogEntry[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: Agent['status']) => void;
}

const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, logs, isOpen, onClose, onUpdateStatus }) => {
  if (!agent) return null;

  const agentLogs = logs.filter(log => log.source === agent.name || log.message.includes(agent.name));

  const colorClasses = {
    blue: 'text-gb-blue',
    yellow: 'text-gb-yellow',
    red: 'text-gb-red',
    green: 'text-gb-green',
    purple: 'text-gb-purple',
    aqua: 'text-gb-aqua',
    orange: 'text-gb-orange',
  };
  const accentColor = colorClasses[agent.color];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`UNIT: ${agent.name}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gb-bg0 border-2 border-gb-bg-h p-2 pixel-art flex justify-center bg-black/20">
             <img 
               src={agent.imageUrl} 
               alt={agent.name}
               className={`w-full aspect-square object-cover grayscale contrast-125`}
             />
          </div>
          
          <div className="space-y-2">
             <div className="flex justify-between items-center bg-gb-bg-h p-2 border border-gb-bg0">
               <span className="text-[10px] uppercase text-gb-gray">Primary Directive</span>
               <span className={`text-xs font-bold ${agent.status === 'RUNNING' ? 'text-gb-green' : agent.status === 'ERROR' ? 'text-gb-red' : 'text-gb-yellow'}`}>
                 {agent.role}
               </span>
             </div>
             
             {/* Persistent Memory Section */}
             <div className="bg-gb-bg-h p-2 border border-gb-bg0 space-y-2">
                <div className="flex justify-between items-center border-b border-gb-gray/20 pb-1">
                    <span className="text-[10px] uppercase text-gb-gray font-bold">Memory Banks</span>
                    <span className="text-[9px] font-mono text-gb-aqua">{agent.memories?.length || 0} ITEMS</span>
                </div>
                
                {agent.memories && agent.memories.length > 0 ? (
                  <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                      {agent.memories.map(memory => (
                        <li key={memory.id} className="text-[10px] border-l-2 border-gb-aqua pl-2 py-1 bg-black/10">
                            <div className="flex justify-between text-gb-gray mb-1">
                                <span className="font-bold">{memory.key}</span>
                                <span>{memory.type}</span>
                            </div>
                            <div className="text-gb-fg leading-tight">{memory.value}</div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <div className="text-[10px] text-gb-gray italic py-4 text-center border border-dashed border-gb-bg0">
                    No persistent data found for this unit.
                  </div>
                )}

                {/* Test Interface to verify persistence */}
                <button 
                  onClick={() => {
                    const fact = prompt("Enter a fact for this agent to remember:");
                    if (fact) {
                      fetch(`/api/agents/${agent.id}/memory`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key: 'USER_OBSERVATION', value: fact, type: 'FACT' })
                      }).then(() => window.location.reload()); // Simple reload for now to see changes
                    }
                  }}
                  className="w-full mt-2 py-1.5 border border-dashed border-gb-aqua text-gb-aqua text-[9px] uppercase font-bold hover:bg-gb-aqua hover:text-gb-bg-h transition-all"
                >
                  + Inject Memory Artifact
                </button>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
                onClick={() => onUpdateStatus?.(agent.id, 'OFFLINE')}
                className="bg-gb-bg0 border border-gb-gray hover:bg-gb-red hover:text-white p-2 text-[10px] font-bold uppercase transition-colors"
            >
              Terminate
            </button>
            <button 
                onClick={() => onUpdateStatus?.(agent.id, 'RUNNING')}
                className="bg-gb-bg0 border border-gb-gray hover:bg-gb-yellow hover:text-gb-bg-h p-2 text-[10px] font-bold uppercase transition-colors"
            >
              Reboot
            </button>
            <button className="bg-gb-bg0 border border-gb-gray hover:bg-gb-aqua hover:text-gb-bg-h p-2 text-[10px] font-bold uppercase transition-colors col-span-2">
              View Source
            </button>
          </div>
        </div>

        {/* Right Column: Live Feed */}
        <div className="lg:col-span-2 flex flex-col h-[500px] border-3 border-gb-bg-h bg-black/20 relative">
           <div className="bg-gb-bg-h p-2 border-b-2 border-gb-bg0 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-gb-gray tracking-widest">Localized Log Feed</span>
              <div className="flex gap-1">
                 <span className="w-2 h-2 rounded-full bg-gb-red animate-pulse"></span>
                 <span className="text-[10px] font-mono text-gb-red">LIVE</span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-2 custom-scrollbar">
              {agentLogs.length === 0 ? (
                 <div className="text-gb-gray italic opacity-50 p-4">No recent telemetry for this unit...</div>
              ) : (
                agentLogs.map(log => (
                  <div key={log.id} className="flex gap-2 hover:bg-white/5 p-1 rounded">
                     <span className="text-gb-gray opacity-50">[{log.timestamp}]</span>
                     <span className={`${
                        log.level === 'ERR' || log.level === 'FAT' ? 'text-gb-red' : 
                        log.level === 'WRN' ? 'text-gb-yellow' : 'text-gb-aqua'
                     } font-bold`}>
                       {log.level}
                     </span>
                     <span className="text-gb-fg break-all">{log.message}</span>
                  </div>
                ))
              )}
           </div>

           {/* Command Input Simulation */}
           <div className="p-2 border-t-2 border-gb-bg0 bg-gb-bg-h flex items-center gap-2">
              <span className={`text-sm font-bold ${accentColor}`}>{agent.name}@ROOT:~#</span>
              <input 
                type="text" 
                disabled
                placeholder="Terminal access restricted..." 
                className="bg-transparent border-none text-xs font-mono text-gb-gray w-full focus:ring-0 cursor-not-allowed"
              />
           </div>
        </div>
      </div>
    </Modal>
  );
};

export default AgentDetailModal;
