import React, { useState, useEffect } from 'react';
import { Agent } from '../types';
import NeuralMap from '../components/synthesis/NeuralMap';

interface AgentSynthesisProps {
    onBack: () => void;
}

const AgentSynthesis: React.FC<AgentSynthesisProps> = ({ onBack }) => {
    const [memories, setMemories] = useState<any[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [showFreqControls, setShowFreqControls] = useState(false);
    const [synthFrequency, setSynthFrequency] = useState(60);
    const [refreshRate, setRefreshRate] = useState(5);
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
                
                {/* CRT Noise Overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] overflow-hidden">
                    <div className="absolute inset-[-200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-grain" />
                </div>

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
                         <button
                            onClick={() => setShowFreqControls(true)}
                            className="w-full py-4 border border-gb-aqua/30 text-gb-aqua bg-gb-aqua/5 font-bold uppercase tracking-widest text-xs hover:border-gb-aqua hover:bg-gb-aqua hover:text-gb-bg0 transition-all">
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

            {/* Frequency Controls Modal */}
            {showFreqControls && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowFreqControls(false)}>
                    <div className="bg-gb-bg0 border-4 border-gb-aqua max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-gb-aqua p-4 flex items-center justify-between">
                            <h2 className="text-xl font-display font-bold uppercase text-gb-bg0">SYNTHESIS FREQUENCY CONTROLS</h2>
                            <button onClick={() => setShowFreqControls(false)} className="text-gb-bg0 hover:text-gb-red">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gb-gray uppercase tracking-wider mb-2 block">
                                        Synthesis Frequency (Hz)
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="120"
                                        value={synthFrequency}
                                        onChange={(e) => setSynthFrequency(Number(e.target.value))}
                                        className="w-full h-2 bg-gb-bg-h rounded-none appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, var(--color-gb-aqua) 0%, var(--color-gb-aqua) ${(synthFrequency / 120) * 100}%, var(--color-gb-bg-h) ${(synthFrequency / 120) * 100}%, var(--color-gb-bg-h) 100%)`
                                        }}
                                    />
                                    <div className="flex justify-between text-[10px] text-gb-gray mt-2">
                                        <span>LOW (10Hz)</span>
                                        <span className="text-gb-aqua font-bold">{synthFrequency}Hz</span>
                                        <span>HIGH (120Hz)</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gb-gray uppercase tracking-wider mb-2 block">
                                        Refresh Rate (seconds)
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="30"
                                        value={refreshRate}
                                        onChange={(e) => setRefreshRate(Number(e.target.value))}
                                        className="w-full h-2 bg-gb-bg-h rounded-none appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, var(--color-gb-aqua) 0%, var(--color-gb-aqua) ${(refreshRate / 30) * 100}%, var(--color-gb-bg-h) ${(refreshRate / 30) * 100}%, var(--color-gb-bg-h) 100%)`
                                        }}
                                    />
                                    <div className="flex justify-between text-[10px] text-gb-gray mt-2">
                                        <span>FAST (1s)</span>
                                        <span className="text-gb-aqua font-bold">{refreshRate}s</span>
                                        <span>SLOW (30s)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gb-aqua/10 border border-gb-aqua/30 p-4">
                                <div className="text-xs font-mono text-gb-fg space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gb-gray">Current Frequency:</span>
                                        <span className="text-gb-aqua font-bold">{synthFrequency}Hz</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gb-gray">Refresh Interval:</span>
                                        <span className="text-gb-aqua font-bold">{refreshRate}s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gb-gray">Processing Power:</span>
                                        <span className="text-gb-aqua font-bold">{Math.round((synthFrequency / 120) * 100)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gb-gray">Memory Usage:</span>
                                        <span className="text-gb-aqua font-bold">{Math.round((synthFrequency * refreshRate) / 10)}MB</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        alert(`Synthesis parameters updated:\n\nFrequency: ${synthFrequency}Hz\nRefresh Rate: ${refreshRate}s\n\nNeural synthesis engine recalibrated.`);
                                        setShowFreqControls(false);
                                    }}
                                    className="flex-1 bg-gb-aqua text-gb-bg0 py-3 font-bold uppercase hover:bg-gb-aqua/80 transition-colors"
                                >
                                    Apply Settings
                                </button>
                                <button
                                    onClick={() => {
                                        setSynthFrequency(60);
                                        setRefreshRate(5);
                                    }}
                                    className="flex-1 bg-gb-bg-h border border-gb-gray/30 text-gb-fg py-3 font-bold uppercase hover:border-gb-gray transition-colors"
                                >
                                    Reset to Default
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Global styles for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes grain {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-5%, -5%); }
        20% { transform: translate(-10%, 5%); }
        30% { transform: translate(5%, -10%); }
        40% { transform: translate(-5%, 15%); }
        50% { transform: translate(-10%, 5%); }
        60% { transform: translate(15%, 0); }
        70% { transform: translate(0, 10%); }
        80% { transform: translate(-15%, 0); }
        90% { transform: translate(10%, 5%); }
    }
    .animate-grain {
        animation: grain 8s steps(10) infinite;
    }
    .animate-spin-slow {
        animation: spin 8s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

export default AgentSynthesis;
