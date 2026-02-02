import React, { useState } from 'react';
import { LogEntry } from '../types';

interface AgentSandboxProps {
  logs: LogEntry[];
  onDeploy: () => void;
}

const AgentSandbox: React.FC<AgentSandboxProps> = ({ logs, onDeploy }) => {
  const [inputCode, setInputCode] = useState(`[REASONING_MODE: DEPTH_PRIORITY]
> Initialize recursive loop...
> Set goal: Solve the traveling salesman problem for galactic coordinates...`);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);

  const handleExecute = () => {
    setIsExecuting(true);
    setExecutionStep(0);
    
    // Simulate execution steps
    const interval = setInterval(() => {
        setExecutionStep(prev => {
            if (prev >= 3) {
                clearInterval(interval);
                setIsExecuting(false);
                return 3;
            }
            return prev + 1;
        });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#333] flex items-center justify-between px-6 bg-[#111]">
            <div className="flex items-center gap-4">
                <div className="bg-[#cc3300] p-2 rounded-sm">
                    <span className="material-symbols-outlined text-white">psychology</span>
                </div>
                <h1 className="font-display font-bold text-xl italic tracking-tighter">AGENT REASONING SANDBOX</h1>
            </div>
            <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 px-4 py-2 bg-[#222] border border-[#444] rounded-sm">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                     <span className="text-xs font-bold tracking-widest text-gray-400">ENGINE: STABLE</span>
                 </div>
                 <div className="flex items-center gap-3">
                     <span className="text-xs font-bold tracking-widest text-[#666]">STRESS TEST</span>
                     <div className="w-10 h-5 bg-[#333] rounded-full relative cursor-pointer">
                         <div className="absolute left-1 top-1 w-3 h-3 bg-gray-500 rounded-full"></div>
                     </div>
                 </div>
                 <button 
                    onClick={onDeploy}
                    className="bg-black border border-[#444] px-6 py-2 text-xs font-bold tracking-widest hover:bg-[#222] transition-colors"
                >
                     DEPLOY AGENT
                 </button>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
            {/* Phase 01: Input Chamber */}
            <div className="w-[25%] border-r border-[#333] flex flex-col bg-[#0f0f0f]">
                <div className="p-4 border-b border-[#333]">
                    <h2 className="text-[#cc3300] text-xs font-bold tracking-[0.2em] uppercase">Phase 01: Input Chamber</h2>
                    <p className="text-gray-500 text-[10px] mt-1">Inject complex multi-step instructions into the latent space.</p>
                </div>
                <div className="flex-1 p-6">
                    <div className="text-[10px] font-bold text-gray-600 uppercase mb-2 tracking-widest">System Prompt Injection</div>
                    <div className="h-full bg-[#e6dab3] text-[#5c5443] p-6 font-mono text-sm leading-relaxed shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] rounded-sm relative selection:bg-[#cc3300] selection:text-white">
                        <textarea 
                            className="w-full h-full bg-transparent border-none outline-none resize-none placeholder-[#8c8473]"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            spellCheck={false}
                        />
                         <div className="absolute bottom-4 right-4 text-[10px] opacity-50">TOKENS: 42</div>
                    </div>
                </div>
                <div className="p-4 border-t border-[#333] bg-[#111] flex gap-4">
                     <button className="flex-1 py-3 bg-black border border-[#333] text-xs font-bold tracking-widest hover:border-gray-500 transition-all">
                         SAVE SCHEMA
                     </button>
                     <button 
                        onClick={handleExecute}
                        className="flex-1 py-3 bg-[#cc3300] text-white text-xs font-bold tracking-widest hover:bg-[#ff4400] transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                         {isExecuting ? 'EXECUTING...' : 'EXECUTE LOGIC'}
                     </button>
                </div>
            </div>

            {/* Middle: Logic Flow */}
            <div className="flex-1 bg-[#0a0a0a] relative flex flex-col items-center py-10 overflow-y-auto custom-scrollbar">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
                />

                <div className="z-10 w-full max-w-2xl flex flex-col gap-8 items-center">
                     <div className="text-[#ffcc00] text-xs font-bold tracking-[0.3em] uppercase mb-4">The Black Box: Logic Flow</div>

                     {/* Step 1: Input Vector */}
                     <div className={`w-full bg-[#cc3300] p-1 shadow-lg transform transition-all duration-500 ${executionStep >= 0 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                         <div className="bg-[#cc3300] p-4 relative overflow-hidden group">
                              <div className="flex justify-between items-start mb-2">
                                  <span className="bg-white text-[#cc3300] text-[10px] font-bold px-2 py-0.5">INPUT_001</span>
                                  <span className="material-symbols-outlined text-white/50 text-sm">input</span>
                              </div>
                              <p className="font-mono text-xs text-white">Parsing complex prompt vector: [92.1, 4.3, -12.4...]</p>
                              <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
                                  <div className="h-full bg-white animate-[loading_2s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
                              </div>
                         </div>
                     </div>
                     
                     {/* Connector */}
                     <div className={`h-8 w-0.5 bg-[#333] transition-colors duration-500 ${executionStep >= 1 ? 'bg-[#ffcc00]' : ''}`} />

                     {/* Step 2: Reasoning */}
                     <div className={`w-full bg-[#ffcc00] p-1 shadow-lg transform transition-all duration-500 ${executionStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                         <div className="bg-[#ffcc00] p-4 text-[#0a0a0a]">
                              <div className="flex justify-between items-start mb-2">
                                  <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5">REASONING_STEP_001</span>
                                  <span className="material-symbols-outlined text-black/50 text-sm animate-spin-slow">settings</span>
                              </div>
                              <p className="font-mono text-xs italic">"The user is requesting a cross-reference between historical data and future projections. I must first query the archive..."</p>
                         </div>
                     </div>

                     {/* Connector */}
                     <div className={`h-8 w-0.5 bg-[#333] transition-colors duration-500 ${executionStep >= 2 ? 'bg-[#ffcc00]' : ''}`} />

                     {/* Step 3: Latent Query */}
                     <div className={`w-full bg-[#ffcc00] p-1 shadow-lg transform transition-all duration-500 ${executionStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                         <div className="bg-[#ffb400] p-4 text-[#0a0a0a]">
                              <div className="flex justify-between items-start mb-2">
                                  <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 transition-all">LATENT_QUERY_042</span>
                                  <span className="material-symbols-outlined text-black/50 text-sm">search</span>
                              </div>
                              <p className="font-mono text-xs">Scanning knowledge weights for: [ANCIENT_ARCHITECTURES, CYBERNETIC_EVOLUTION]</p>
                         </div>
                     </div>

                     {/* Connector */}
                     <div className={`h-8 w-0.5 bg-[#333] transition-colors duration-500 ${executionStep >= 3 ? 'bg-[#666]' : ''}`} />

                      {/* Step 4: Synthesis Pending */}
                      <div className={`w-full border border-[#444] bg-[#222] p-4 opacity-50 transform transition-all duration-500 ${executionStep >= 3 ? 'opacity-100 border-green-500/50 bg-green-900/10' : ''}`}>
                          <div className="flex justify-between items-center mb-2">
                              <span className="bg-[#444] text-white text-[10px] font-bold px-2 py-0.5">SYNTHESIS_PENDING</span>
                              <span className="material-symbols-outlined text-gray-500 text-sm">sync</span>
                          </div>
                          <div className="h-2 bg-[#111] w-full rounded-full overflow-hidden">
                              <div className={`h-full bg-green-500 transition-all duration-1000 ${executionStep >= 3 ? 'w-full' : 'w-0'}`}></div>
                          </div>
                      </div>

                </div>
            </div>

            {/* Phase 02: Synthesized Output */}
            <div className="w-[30%] border-l border-[#333] bg-[#111] flex flex-col">
                 <div className="p-4 border-b border-[#333] flex justify-between items-center">
                    <div>
                        <h2 className="text-[#ffcc00] text-xs font-bold tracking-[0.2em] uppercase">Phase 02: Synthesized Output</h2>
                        <p className="text-gray-500 text-[10px] mt-1">Final agent response after logic traversal.</p>
                    </div>
                    <div className="p-2 border border-[#444] rounded-sm hover:bg-[#222] cursor-pointer">
                        <span className="material-symbols-outlined text-gray-400 text-sm">content_copy</span>
                    </div>
                </div>
                
                <div className="flex-1 p-8 overflow-y-auto">
                    <h3 className="font-mono text-lg font-bold text-white mb-6">Analysis Complete.</h3>
                    
                    <p className="font-mono text-xs text-gray-400 mb-6 leading-relaxed">
                        Based on the multi-step reasoning trace observed in the central processing chamber, the following synthesis has been generated:
                    </p>

                    <div className="bg-[#0a0a0a] border-l-2 border-[#ffcc00] p-6 mb-8 font-mono text-xs text-gray-300">
                        <pre className="whitespace-pre-wrap">{`{
  "status": "OPTIMIZED",
  "prediction": 0.9842,
  "anomalies": null,
  "recommendation": 
    "PROCEED_WITH_CAUTION"
}`}</pre>
                    </div>

                    <p className="font-mono text-xs text-gray-400 leading-relaxed mb-8">
                        The agent concludes that the proposed architecture aligns with the historical parameters while introducing a novel recursive feedback loop that increases stability by 14% across all simulated environments.
                    </p>
                </div>

                {/* Footer Stats */}
                <div className="p-4 border-t border-[#333] bg-[#0f0f0f]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold tracking-widest text-[#666]">AGENT STABILITY</span>
                        <span className="text-[10px] font-bold tracking-widest text-[#ffcc00]">99.2%</span>
                    </div>
                    <div className="h-1 bg-[#222] w-full mb-6">
                        <div className="h-full bg-[#ffcc00] w-[99%]"></div>
                    </div>

                    <div className="bg-[#cc3300]/10 border border-[#cc3300]/30 p-3 flex items-start gap-3">
                         <span className="material-symbols-outlined text-[#cc3300] text-sm mt-0.5">warning</span>
                         <span className="text-[10px] text-[#cc3300] font-bold leading-tight">STRESS TEST AVAILABLE. ACTIVATE TOGGLE TO INJECT ADVERSARIAL NOISE.</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Bar */}
        <div className="h-8 bg-black border-t border-[#333] flex items-center justify-between px-6 text-[9px] font-mono text-[#666] tracking-widest uppercase">
            <div className="flex gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffcc00]"></div>
                    <span>SYSTEM_READY</span>
                </div>
                <span>GRID: 24px x 24px</span>
                <span>Z-INDEX: NOMINAL</span>
            </div>
            <div className="flex gap-6">
                <span>V1.0.4-REASONING-STABLE</span>
                <span>© 2024 AGENTIC_CORE</span>
            </div>
        </div>
    </div>
  );
};

export default AgentSandbox;
