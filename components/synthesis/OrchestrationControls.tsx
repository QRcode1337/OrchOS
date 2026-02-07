import React, { useState } from 'react';
import { Agent } from '../../types';

interface OrchestrationControlsProps {
    agents: Agent[];
    selectedAgents: string[];
    onToggleAgent: (id: string) => void;
    onInitiate: (mission: string, priority: string) => void;
    isProcessing: boolean;
}

const OrchestrationControls: React.FC<OrchestrationControlsProps> = ({ 
    agents, 
    selectedAgents, 
    onToggleAgent, 
    onInitiate,
    isProcessing 
}) => {
    const [mission, setMission] = useState('');
    const [priority, setPriority] = useState('MED');

    return (
        <div className="flex flex-col h-full bg-gb-bg0/60 backdrop-blur-md p-6 border-r border-gb-gray/20">
            {/* Header */}
            <div className="mb-8">
                <div className="text-xs font-bold text-gb-gray/60 uppercase tracking-widest mb-[-5px]">
                    MISSION_CONTROL // INPUT
                </div>
                <h2 className="text-xl font-display font-bold text-gb-fg uppercase">
                    DIRECTIVE_PANEL
                </h2>
            </div>

            {/* Mission Input */}
            <div className="mb-8">
                 <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] font-bold text-gb-aqua uppercase tracking-wider">
                        Primary_Objective
                    </label>
                    <span className="text-[9px] text-gb-gray">{mission.length}/120 CHARS</span>
                 </div>
                 <textarea 
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    disabled={isProcessing}
                    placeholder="ENTER MISSION PARAMETERS..."
                    className="w-full h-24 bg-gb-bg0 border border-gb-gray/30 p-3 text-xs font-mono text-gb-fg focus:border-gb-aqua focus:outline-none focus:ring-1 focus:ring-gb-aqua/50 resize-none placeholder:text-gb-gray/30"
                 />
            </div>

            {/* Priority Selector */}
            <div className="mb-8">
                <div className="text-[10px] font-bold text-gb-yellow uppercase tracking-wider mb-2">
                    PRIORITY_LEVEL
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {['LOW', 'MED', 'HIGH'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPriority(p)}
                            disabled={isProcessing}
                            className={`py-2 border text-[10px] font-bold tracking-widest transition-all
                                ${priority === p 
                                    ? 'border-gb-yellow bg-gb-yellow/20 text-gb-yellow' 
                                    : 'border-gb-gray/30 text-gb-gray hover:border-gb-gray/60 hover:text-gb-fg'
                                }
                            `}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Agent Selector */}
            <div className="flex-1 overflow-hidden flex flex-col mb-6">
                <div className="text-[10px] font-bold text-gb-green uppercase tracking-wider mb-2 flex justify-between">
                    <span>AVAILABLE_ASSETS</span>
                    <span className="text-gb-gray">{selectedAgents.length} SELECTED</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                    {agents.map((agent) => (
                        <div 
                            key={agent.id}
                            onClick={() => !isProcessing && onToggleAgent(agent.id)}
                            className={`
                                flex items-center justify-between p-2 cursor-pointer border transition-all
                                ${selectedAgents.includes(agent.id)
                                    ? 'bg-gb-green/10 border-gb-green text-gb-fg'
                                    : 'bg-transparent border-gb-gray/20 text-gb-gray/60 hover:border-gb-gray/40'
                                }
                                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${selectedAgents.includes(agent.id) ? 'bg-gb-green' : 'bg-gb-gray'}`} />
                                <span className="text-[10px] font-mono font-bold uppercase">{agent.name}</span>
                            </div>
                            <span className="text-[9px] uppercase">{agent.role}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <button
                disabled={!mission || selectedAgents.length === 0 || isProcessing}
                onClick={() => onInitiate(mission, priority)}
                className={`
                    w-full py-4 font-bold uppercase tracking-[0.2em] text-xs transition-all border
                    ${(!mission || selectedAgents.length === 0)
                        ? 'border-gb-gray/20 text-gb-gray bg-transparent cursor-not-allowed'
                        : isProcessing 
                            ? 'border-gb-aqua text-gb-aqua bg-gb-aqua/10 animate-pulse cursor-wait'
                            : 'border-gb-aqua text-gb-bg0 bg-gb-aqua hover:bg-gb-aqua/90 hover:shadow-[0_0_15px_rgba(142,192,124,0.3)]'
                    }
                `}
            >
                {isProcessing ? 'PROCESSING_Directive...' : 'INITIATE_SEQUENCE'}
            </button>
        </div>
    );
};

export default OrchestrationControls;
