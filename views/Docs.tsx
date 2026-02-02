import React from 'react';
import { ViewMode } from '../types';

interface DocsProps {
  onBack: () => void;
}

const Docs: React.FC<DocsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-li-bg-light text-li-ink-dark font-display p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 border-b-2 border-li-ink-dark pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight">VOID ANALYZER</h1>
            <p className="font-mono text-sm opacity-60 mt-2">SYSTEM DIAGNOSTICS & DOCUMENTATION // v4.2.0</p>
          </div>
          <button 
            onClick={onBack}
            className="px-6 py-2 border-2 border-li-ink-dark font-bold uppercase hover:bg-li-ink-dark hover:text-li-bg-light transition-colors"
          >
            Back
          </button>
        </header>

        <main className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-4 bg-li-primary"></span>
              Agent Deployment
            </h2>
            <div className="prose font-body max-w-none bg-white p-8 border-2 border-li-ink-dark hard-shadow">
              <p className="mb-4">
                Orchestra OS utilizes a containerized deployment strategy for all autonomous agents. 
                Agents are defined using the <code>agent.config.json</code> manifest which dictates memory allocation, 
                tool access, and behavioral constraints.
              </p>
              <pre className="bg-li-ink-dark text-li-bg-light p-4 font-mono text-sm overflow-x-auto">
{`{
  "designation": "OMEGA-12",
  "role": "DATA_MINING",
  "permissions": ["READ_FS", "NET_ACCESS"],
  "model": "gemini-pro-vision",
  "memory_limit": "4GB"
}`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-4 bg-li-accent-blue"></span>
              Inter-Agent Communication
            </h2>
            <div className="prose font-body max-w-none">
              <p>
                Agents communicate via a high-speed message bus (Orchestra-Link). Messages are strongly typed 
                and validated against a central schema registry to prevent hallucinated API calls.
                Latency is maintained below 50ms for local clusters.
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-4 bg-li-accent-red"></span>
              Security Protocols
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="border border-li-ink-dark p-4 bg-li-bg-light">
                  <h3 className="font-bold uppercase mb-2">Sandbox</h3>
                  <p className="text-sm">All code execution occurs in ephemeral WASM environments.</p>
               </div>
               <div className="border border-li-ink-dark p-4 bg-li-bg-light">
                  <h3 className="font-bold uppercase mb-2">Audit Log</h3>
                  <p className="text-sm">Immutable ledger of all agent decisions and tool outputs.</p>
               </div>
            </div>
          </section>
        </main>
        
        <footer className="mt-20 pt-8 border-t border-li-ink-dark/20 text-center font-mono text-xs opacity-50">
            DOCUMENTATION GENERATED AUTOMATICALLY BY SYS_DOC_GEN_V2
        </footer>
      </div>
    </div>
  );
};

export default Docs;
