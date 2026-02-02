import React, { useState, useEffect } from 'react';
import { Agent, LogEntry } from '../types';
import NeuralMap from '../components/synthesis/NeuralMap';

interface AgentSynthesisProps {
    onBack: () => void;
}

const AgentSynthesis: React.FC<AgentSynthesisProps> = ({ onBack }) => {
    const [memories, setMemories] = useState<any[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const TARGET_MEMORIES = 20;
    const progress = memories.length > 0 ? Math.min(100, Math.round((memories.length / TARGET_MEMORIES) * 100)) : 0;

    useEffect(() => {
        const fetchGlobalMemories = async () => {
            try {
                const res = await fetch('/api/agents');
                if (res.ok) {
                    const data: Agent[] = await res.json();
                    setAgents(data);
                    const allMemories = data.flatMap((a: any) => 
                        (a.memories || []).map((m: any) => ({ 
                            ...m, 
                            agentName: a.name,
                            agentId: a.id
                        }))
                    );
                    setMemories(allMemories);
                }
            } catch (err) {
                console.error("Failed to load global synthesis:", err);
            }
        };
        fetchGlobalMemories();
    }, []);

    const synthesisLogs: { time: string; msg: string; type?: string }[] = [
        { time: '14:22:01', msg: 'Accessing CORTEX_DEV knowledge base...', type: 'info' },
        { time: '14:22:04', msg: `Scanning ${memories.length} persistent artifacts...`, type: 'info' },
        ...memories.slice(-5).map(m => ({ 
            time: 'LIVE', 
            msg: `Synthesizing fact: ${m.key} from ${m.agentName}`,
            type: 'info' 
        })),
        { time: 'STATUS', msg: `Knowledge convergence at ${progress}%`, type: 'info' },
    ];

    return (
        <div className="flex flex-col h-full bg-gb-bg0 text-gb-fg font-mono overflow-hidden select-none">
            {/* Header / Top Bar */}
            <div className="h-12 border-b border-gb-gray/20 flex items-center justify-between px-6 bg-gb-bg0 z-10">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gb-red animate-pulse">hexagon</span>
                    <span className="font-display font-bold uppercase tracking-widest text-lg text-gb-fg">CORTEX ANALYZER // KNOWLEDGE SYNTHESIS</span>
                </div>
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 border border-gb-red/30 bg-gb-red/10 px-3 py-1 rounded-sm">
                        <div className="w-2 h-2 rounded-full bg-gb-red animate-ping" />
                        <span className="text-xs text-gb-red tracking-wider">LIVE_UPLINK</span>
                     </div>
                     <span className="material-symbols-outlined text-gb-gray/50 cursor-pointer hover:text-gb-fg" onClick={onBack}>close</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Background Grid */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                     style={{ 
                         backgroundImage: 'radial-gradient(circle, #aeadaf 1px, transparent 1px)', 
                         backgroundSize: '30px 30px' 
                     }} 
                />

                {/* Left Panel: Artifact Stats */}
                <div className="w-80 border-r border-gb-gray/20 p-6 flex flex-col gap-8 z-10 bg-gb-bg0/50 backdrop-blur-sm">
                    <div className="text-xs font-bold text-gb-gray/60 uppercase tracking-widest mb-[-10px]">
                        NEURAL_DATABASE // SYNTHESIS_MATRIX
                    </div>

                    <div>
                         <div className="text-xs font-bold text-gb-gray/60 uppercase tracking-widest mb-4">COLLATION_METRICS</div>
                         <div className="space-y-4">
                            <div className="bg-gb-bg-h border border-gb-gray/20 p-3">
                                <div className="text-[10px] text-gb-gray mb-1 uppercase">Total Artifacts</div>
                                <div className="text-2xl font-display font-bold text-gb-fg">{memories.length}</div>
                            </div>
                            <div className="bg-gb-bg-h border border-gb-gray/20 p-3">
                                <div className="text-[10px] text-gb-gray mb-1 uppercase">Target Convergence</div>
                                <div className="text-2xl font-display font-bold text-gb-yellow">{TARGET_MEMORIES}</div>
                            </div>
                            <div className="bg-gb-bg-h border border-gb-gray/20 p-3">
                                <div className="text-[10px] text-gb-gray mb-1 uppercase">Coherence Factor</div>
                                <div className="text-2xl font-display font-bold text-gb-aqua">{(progress * 0.98).toFixed(2)}</div>
                            </div>
                         </div>
                    </div>

                     {/* Sources Status */}
                    <div>
                         <div className="text-xs font-bold text-gb-gray/60 uppercase tracking-widest mb-2">SOURCE_AUTH_STATUS</div>
                         <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                            {Array.from(new Set(memories.map(m => m.agentName))).map((name: any) => (
                                <div key={name} className="flex justify-between items-center text-[10px] bg-gb-bg-h p-2 border border-gb-bg0">
                                    <span className="text-gb-fg font-bold">{name}</span>
                                    <span className="text-gb-green">ACTIVE</span>
                                </div>
                            )) || <div className="text-[10px] text-gb-gray italic">No artifacts found.</div>}
                         </div>
                    </div>
                </div>

                {/* Center Stage: Neural Map Visualization */}
                <div className="flex-1 flex flex-col relative z-10 overflow-hidden bg-gb-bg0/20">
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 font-bold text-gb-gray/40 tracking-[0.2em] text-[10px] uppercase">Neural_Map // Artifact_Convergence_Graph</div>
                    
                    <div className="flex-1 w-full">
                        <NeuralMap agents={agents} memories={memories} convergence={progress} />
                    </div>

                    <div className="h-16 border-t border-gb-gray/10 flex items-center justify-between px-10 bg-gb-bg0/40">
                         <div className="flex gap-10">
                            <div>
                                <div className="text-[9px] text-gb-gray uppercase font-bold mb-1">Convergence_Strength</div>
                                <div className="text-xs font-bold text-gb-aqua">{progress.toFixed(2)}%</div>
                            </div>
                            <div>
                                <div className="text-[9px] text-gb-gray uppercase font-bold mb-1">Active_Nodes</div>
                                <div className="text-xs font-bold text-gb-fg">{agents.length + memories.length}</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="text-[9px] text-gb-gray font-bold">MODE: FORCE_DIRECTED_PHYSICS</div>
                             <div className="w-2 h-2 rounded-full bg-gb-green" />
                         </div>
                    </div>
                </div>

                {/* Right Panel: Output */}
                <div className="w-96 border-l border-gb-gray/20 flex flex-col bg-gb-bg0/50 backdrop-blur-sm z-10">
                     <div className="p-4 border-b border-gb-gray/20 flex justify-between items-center">
                         <span className="font-bold text-xs uppercase tracking-wider text-gb-fg">SYSTEM OUTPUT</span>
                         <span className="text-[10px] text-gb-green tracking-wider">Top-Lvl Process::RUNNING</span>
                     </div>
                     
                     {/* Logs */}
                     <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] space-y-2 opacity-80 custom-scrollbar">
                         {synthesisLogs.map((log, i) => (
                             <div key={i} className={`flex gap-3 ${log.type === 'error' ? 'text-gb-red' : log.type === 'warn' ? 'text-gb-yellow' : 'text-gb-gray'}`}>
                                 <span className="opacity-50">[{log.time}]</span>
                                 <span>{log.msg}</span>
                             </div>
                         ))}
                         {/* Blinking cursor */}
                         <div className="w-2 h-4 bg-gb-gray/50 animate-pulse mt-2" />
                     </div>

                     {/* Actions */}
                     <div className="p-6 border-t border-gb-gray/20 space-y-3">
                         <button 
                            onClick={onBack}
                            className="w-full py-4 border border-gb-red text-gb-red bg-gb-red/5 font-bold uppercase tracking-widest text-xs hover:bg-gb-red hover:text-gb-bg0 transition-all">
                             ABORT_SYNTHESIS
                         </button>
                         <button className="w-full py-4 border border-gb-gray/30 text-gb-gray bg-gb-gray/5 font-bold uppercase tracking-widest text-xs hover:border-gb-fg hover:text-gb-fg transition-all">
                             ADJUST_FREQ
                         </button>
                     </div>
                </div>
            </div>

            {/* Footer Status Bar */}
            <div className="h-8 border-t border-gb-gray/20 flex items-center justify-between px-6 bg-gb-bg0 text-[9px] font-mono text-gb-gray uppercase z-20">
                 <div className="flex gap-6">
                     <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-gb-yellow" />
                         <span>CPU_LOAD: 94%</span>
                     </div>
                     <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-gb-green" />
                         <span>NET_IO: 1.2GB/S</span>
                     </div>
                 </div>
                 <div>
                     KERNEL: SYNTH_OS_V8.9.1 // 2024-SYS-TERM
                 </div>
            </div>
        </div>
    );
};

export default AgentSynthesis;
