import React from 'react';
import { ViewMode } from '../types';

interface DocsProps {
  onBack: () => void;
}

const Docs: React.FC<DocsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gb-bg0 text-gb-fg font-mono p-6 md:p-12 selection:bg-gb-aqua selection:text-gb-bg0">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-b-2 border-gb-gray/20 pb-6 flex justify-between items-center bg-gb-bg0 sticky top-0 z-20 pt-4">
          <div>
            <h1 className="text-4xl font-display font-black uppercase tracking-tight text-gb-fg">System Manual</h1>
            <p className="font-mono text-sm text-gb-gray mt-2">ORCHESTRA_OS // ARCHITECTURE & UTILITY AUDIT // v4.2.0</p>
          </div>
          <button 
            onClick={onBack}
            className="px-6 py-2 border border-gb-red text-gb-red font-bold uppercase hover:bg-gb-red hover:text-gb-bg0 transition-colors"
          >
            Close Manual
          </button>
        </header>

        <main className="space-y-16">
          <section>
            <div className="flex items-center gap-3 mb-6">
                 <span className="material-symbols-outlined text-gb-aqua text-3xl">hub</span>
                 <h2 className="text-2xl font-bold uppercase text-gb-fg">Core Modules</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Module 1: Orchestrator */}
                <div className="border border-gb-aqua/30 bg-gb-aqua/5 p-6 relative overflow-hidden group hover:border-gb-aqua transition-colors">
                    <div className="absolute top-0 right-0 bg-gb-aqua text-gb-bg0 text-[10px] font-bold px-2 py-1 uppercase">
                        Utility: CRITICAL
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2 text-gb-aqua">Agent Orchestrator</h3>
                    <p className="text-sm text-gb-gray mb-4">
                        The primary command center for dispatching missions and managing active agent threads. 
                        Replaces the passive visualization with active controls.
                    </p>
                    <ul className="text-xs space-y-1 text-gb-gray/80 list-disc list-inside">
                        <li>Mission Directive Input</li>
                        <li>Priority Queue Management</li>
                        <li>Batch Agent Dispatch</li>
                        <li>Real-time Synthesis Feedback</li>
                    </ul>
                </div>

                {/* Module 2: Dashboard */}
                <div className="border border-gb-green/30 bg-gb-green/5 p-6 relative overflow-hidden group hover:border-gb-green transition-colors">
                     <div className="absolute top-0 right-0 bg-gb-green text-gb-bg0 text-[10px] font-bold px-2 py-1 uppercase">
                        Utility: HIGH
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2 text-gb-green">Main Dashboard</h3>
                    <p className="text-sm text-gb-gray mb-4">
                        High-level system overview. Provides health metrics, active unit counts, and global resource usage.
                    </p>
                    <ul className="text-xs space-y-1 text-gb-gray/80 list-disc list-inside">
                        <li>System Throughput Charts</li>
                        <li>Active Agent List</li>
                        <li>Resource Deployment Stats</li>
                        <li>Global Navigation Hub</li>
                    </ul>
                </div>

                {/* Module 3: Sandbox */}
                <div className="border border-gb-yellow/30 bg-gb-yellow/5 p-6 relative overflow-hidden group hover:border-gb-yellow transition-colors">
                     <div className="absolute top-0 right-0 bg-gb-yellow text-gb-bg0 text-[10px] font-bold px-2 py-1 uppercase">
                        Utility: MEDIUM
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2 text-gb-yellow">Agent Sandbox</h3>
                    <p className="text-sm text-gb-gray mb-4">
                        Isolated CLI environment for testing specific agent behaviors or running single-threaded commands.
                    </p>
                    <ul className="text-xs space-y-1 text-gb-gray/80 list-disc list-inside">
                        <li>Direct Terminal Interface</li>
                        <li>Isolated Execution Environment</li>
                        <li>Debug Log Stream</li>
                    </ul>
                </div>

                {/* Module 4: Visualizer */}
                <div className="border border-gb-gray/30 bg-gb-gray/5 p-6 relative overflow-hidden group hover:border-gb-fg transition-colors">
                     <div className="absolute top-0 right-0 bg-gb-gray text-gb-bg0 text-[10px] font-bold px-2 py-1 uppercase">
                        Utility: LOW (Visual)
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2 text-gb-fg">Cortex visualizer</h3>
                    <p className="text-sm text-gb-gray mb-4">
                        (Formerly "Agent Synthesis"). A passive Force-Directed Graph visualization of neural connections.
                        Looks impressive but offers limited operational control.
                    </p>
                    <ul className="text-xs space-y-1 text-gb-gray/80 list-disc list-inside">
                        <li>Knowledge Graph Visualization</li>
                        <li>Theatrical "Screensaver" Mode</li>
                        <li>System Aesthtics Demo</li>
                    </ul>
                </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
                 <span className="material-symbols-outlined text-gb-red text-3xl">build</span>
                 <h2 className="text-2xl font-bold uppercase text-gb-fg">System Architecture</h2>
            </div>
            
            <div className="bg-gb-bg-h border border-gb-gray/20 p-8 font-mono text-sm leading-relaxed">
                <p className="mb-4">
                    <strong className="text-gb-aqua">FRONTEND:</strong> React 18 + Vite. Styled using a custom Tailwind configuration designed for "Retro-Futurist" aesthetics (Gruvbox Dark).
                </p>
                <p className="mb-4">
                    <strong className="text-gb-green">STATE:</strong> Hybrid architecture. 
                    <br/>- <em>Optimistic UI</em> updates for immediate feedback.
                    <br/>- <em>SQLite + Prisma</em> for persistence (Agents, Logs).
                    <br/>- <em>Express API</em> server for backend orchestration.
                </p>
                <p className="mb-4">
                    <strong className="text-gb-yellow">DEPLOYMENT:</strong> 
                    <br/>- Agents are defined as JSON manifests.
                    <br/>- "Orchestration" is currently simulated via `setTimeout` loops for UI demonstration.
                    <br/>- Future roadmap includes binding to actual LLM endpoints (Gemini/GPT-4).
                </p>
            </div>
          </section>

          <section>
             <div className="flex items-center gap-3 mb-6">
                 <span className="material-symbols-outlined text-gb-purple text-3xl">warning</span>
                 <h2 className="text-2xl font-bold uppercase text-gb-fg">Known Limitations</h2>
            </div>
            <div className="border border-gb-red/20 bg-gb-red/5 p-6 text-xs font-mono text-gb-red">
                <ul className="list-disc list-inside space-y-2">
                    <li>The <strong>Cortex Visualizer</strong> was formerly hijacking this Documentation view. It has been moved to its own route.</li>
                    <li><strong>Simulation Mode:</strong> Most agent "actions" are currently simulated. The backend connection needs to be wired to a real inference engine.</li>
                    <li><strong>Responsiveness:</strong> Global Map Views require WebGL2 and a large viewport. Mobile experience is limited.</li>
                </ul>
            </div>
          </section>
        </main>
        
        <footer className="mt-20 pt-8 border-t border-gb-gray/20 text-center font-mono text-[10px] text-gb-gray opacity-50">
            SYSTEM_AUDIT_LOG_ID: A-992-X // LAST_UPDATED: 2026-02-02
        </footer>
      </div>
    </div>
  );
};

export default Docs;

