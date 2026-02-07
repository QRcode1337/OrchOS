import React, { useState } from 'react';
import { ViewMode } from '../types';

interface LandingPageProps {
  onLaunch: () => void;
  onViewDocs: () => void;
  onViewTerminal?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch, onViewDocs, onViewTerminal }) => {
  const [isLightMode, setIsLightMode] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState<'logic' | 'memory' | 'features' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install orchestra-os');
    console.log('Copied to clipboard');
    alert('Command copied to clipboard!');
  };

  const infoModals = {
    logic: {
      title: 'LOGIC MODULE',
      content: 'Chain-of-thought processing engine. Deterministic execution paths for critical agentic workflows with structured reasoning and decision trees.'
    },
    memory: {
      title: 'MEMORY CORE',
      content: 'Vector database integration with infinite context window. Persistent storage and retrieval for long-term agent knowledge and state management.'
    },
    features: {
      title: 'FEATURES',
      content: 'Comprehensive agent orchestration system including real-time monitoring, multi-agent coordination, snapshot management, and neural synthesis capabilities.'
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLightMode ? 'bg-li-bg-light text-li-ink-dark' : 'bg-lp-bg-dark text-white'}`}>
      
      {/* View Toggle */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-2">
         <button 
           onClick={() => setIsLightMode(!isLightMode)}
           className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all shadow-lg hover:scale-110 ${
             isLightMode 
             ? 'bg-li-ink-dark border-li-bg-light text-li-bg-light' 
             : 'bg-white border-lp-primary text-lp-bg-dark'
           }`}
           title="Toggle System Theme"
         >
           <span className="material-symbols-outlined">{isLightMode ? 'dark_mode' : 'light_mode'}</span>
         </button>
      </div>

      {isLightMode ? (
        // LIGHT MODE LAYOUT (Infinite Agency)
        <div className="font-display overflow-x-hidden relative text-li-ink-dark">
          <div className="fixed inset-0 bg-grid-pattern bg-[length:40px_40px] pointer-events-none z-0 opacity-30"></div>
          
          <nav className="fixed top-0 left-0 w-full z-40 bg-li-bg-light/90 backdrop-blur-sm border-b-2 border-li-ink-dark">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-li-ink-dark flex items-center justify-center">
                  <span className="material-symbols-outlined text-li-bg-light" style={{fontSize: '20px'}}>deployed_code</span>
                </div>
                <span className="text-lg font-bold tracking-wider">ORCHESTRA OS</span>
                <span className="px-2 py-0.5 bg-purple-100 border border-purple-500 text-purple-600 text-[9px] font-bold uppercase tracking-[0.15em] font-mono animate-pulse">PROTOTYPE</span>
              </div>
              <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide">
                <button onClick={onViewDocs} className="hover:text-li-primary transition-colors">DOCS</button>
                <button onClick={() => setShowInfoModal('logic')} className="hover:text-li-primary transition-colors">LOGIC</button>
                <button onClick={() => setShowInfoModal('memory')} className="hover:text-li-primary transition-colors">MEMORY</button>
              </div>
              <div className="flex items-center">
                <button className="bg-li-ink-dark text-li-bg-light px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-li-primary hover:text-li-ink-dark transition-colors">
                  System Status: OK
                </button>
              </div>
            </div>
          </nav>

          <main className="relative z-10 pt-20 flex flex-col items-center">
            <section className="w-full max-w-7xl mx-auto min-h-[85vh] flex flex-col md:flex-row items-center justify-center relative px-6 py-12">
               {/* Decorative Lines */}
               <div className="absolute top-20 left-10 w-32 h-[2px] bg-li-ink-dark hidden md:block"></div>
               <div className="absolute top-20 left-10 w-[2px] h-32 bg-li-ink-dark hidden md:block"></div>
               <div className="absolute bottom-20 right-10 w-48 h-[2px] bg-li-ink-dark hidden md:block"></div>

               <div className="flex-1 flex flex-col justify-center items-start z-20 space-y-8">
                  <div className="inline-block px-3 py-1 border-2 border-li-ink-dark text-xs font-bold tracking-[0.2em] uppercase">
                     Build v3.0.1
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase text-li-ink-dark">
                     Infinite<br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-li-primary to-li-accent-yellow">Agency</span>
                  </h1>
                  <p className="text-lg md:text-xl max-w-lg font-body leading-relaxed border-l-4 border-li-primary pl-6">
                     Structured logic for autonomous systems. A minimalist architecture for the next generation of AI management.
                  </p>
                  <div className="flex gap-4 pt-4">
                     <button onClick={onLaunch} className="hard-shadow bg-li-ink-dark text-li-bg-light px-8 py-4 text-sm font-bold uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100 border-2 border-li-ink-dark">
                        Initialize Core
                     </button>
                     <button onClick={onViewDocs} className="px-8 py-4 text-sm font-bold uppercase tracking-widest border-2 border-li-ink-dark hover:bg-li-ink-dark hover:text-li-bg-light transition-colors">
                        Read Manifesto
                     </button>
                  </div>
               </div>

               {/* Visual Core */}
               <div className="flex-1 w-full flex items-center justify-center relative mt-12 md:mt-0">
                  <div className="relative w-64 h-64 md:w-80 md:h-80 group perspective-1000">
                     <div className="absolute inset-0 border-4 border-li-ink-dark rotate-45 transform transition-transform duration-700 group-hover:rotate-0 bg-transparent z-10"></div>
                     <div className="absolute inset-4 border-2 border-li-primary rotate-12 transform transition-transform duration-500 group-hover:rotate-0 z-20"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 bg-li-ink-dark hard-shadow rotate-[-10deg] overflow-hidden relative z-30 flex items-center justify-center">
                           <div className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-overlay" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNDbynVeYziV4lXI84unTAJoan26Q6g6-PKVwIfFYMSi8tVnhiek4jzI9i1YKV_JRQqN0UAWFipajqVNkAqU65ZCRqRSd1HgjNtxdln5vz4Nz_Ccpq1MI87OrU4Xi4R8uXsQsKiqfxCKQMxzoLo-47NjykZyZ4tmcw7z1sUNtbge0lD73nZdsbXoYuWsOCnX__spEbJLTX84n7Rm2FoSyWIxn52F6He66SW3gCaFfnoEJDgHddb8u05OiP1oNr1FDd8TACl6d4uD8")'}}></div>
                           <span className="material-symbols-outlined text-li-primary text-6xl animate-pulse">hub</span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Features Timeline */}
            <section className="w-full max-w-5xl mx-auto px-6 py-24 relative">
               <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[4px] bg-li-ink-dark transform md:-translate-x-1/2"></div>
               <div className="flex flex-col gap-24 relative">
                  {/* Node 1 */}
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
                     <div className="absolute left-[-2px] md:left-1/2 top-0 w-5 h-5 bg-li-primary border-2 border-li-ink-dark transform md:-translate-x-1/2 md:translate-y-6 rounded-none z-10"></div>
                     <div className="w-full md:w-1/2 md:text-right md:pr-12 md:mt-6 order-2 md:order-1">
                        <h3 className="text-3xl font-bold uppercase tracking-tight mb-2">Logic Module</h3>
                        <p className="font-body text-sm opacity-70 mb-4">Chain of thought processing.</p>
                     </div>
                     <div className="w-full md:w-1/2 pl-8 md:pl-12 order-1 md:order-2">
                        <div className="bg-li-accent-red p-1 border-2 border-li-ink-dark hard-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                           <div className="bg-li-bg-light p-6 h-full flex flex-col gap-4">
                              <div className="w-10 h-10 bg-li-accent-red flex items-center justify-center border-2 border-li-ink-dark text-white">
                                 <span className="material-symbols-outlined">psychology</span>
                              </div>
                              <div className="space-y-2">
                                 <h4 className="font-bold text-lg uppercase">Thinking Engine</h4>
                                 <p className="text-sm">Deterministic execution paths for critical agentic workflows.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  {/* Node 2 */}
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
                     <div className="absolute left-[-2px] md:left-1/2 top-0 w-5 h-5 bg-li-primary border-2 border-li-ink-dark transform md:-translate-x-1/2 md:translate-y-6 rounded-none z-10"></div>
                     <div className="w-full md:w-1/2 pr-8 md:pr-12 order-1">
                        <div className="bg-li-accent-green p-1 border-2 border-li-ink-dark hard-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                           <div className="bg-li-bg-light p-6 h-full flex flex-col gap-4">
                              <div className="w-10 h-10 bg-li-accent-green flex items-center justify-center border-2 border-li-ink-dark text-white">
                                 <span className="material-symbols-outlined">hard_drive</span>
                              </div>
                              <div className="space-y-2">
                                 <h4 className="font-bold text-lg uppercase">Memory Core</h4>
                                 <p className="text-sm">Vector database integration with infinite context window.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="w-full md:w-1/2 md:pl-12 md:mt-6 order-2">
                        <h3 className="text-3xl font-bold uppercase tracking-tight mb-2">Persistent Context</h3>
                        <p className="font-body text-sm opacity-70 mb-4">Long-term storage and retrieval.</p>
                     </div>
                  </div>
                  {/* Node 3 */}
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
                     <div className="absolute left-[-2px] md:left-1/2 top-0 w-5 h-5 bg-li-primary border-2 border-li-ink-dark transform md:-translate-x-1/2 md:translate-y-6 rounded-none z-10"></div>
                     <div className="w-full md:w-1/2 md:text-right md:pr-12 md:mt-6 order-2 md:order-1">
                        <h3 className="text-3xl font-bold uppercase tracking-tight mb-2">Action Layer</h3>
                        <p className="font-body text-sm opacity-70 mb-4">Multi-modal tool execution.</p>
                     </div>
                     <div className="w-full md:w-1/2 pl-8 md:pl-12 order-1 md:order-2">
                        <div className="bg-li-accent-blue p-1 border-2 border-li-ink-dark hard-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                           <div className="bg-li-bg-light p-6 h-full flex flex-col gap-4">
                              <div className="w-10 h-10 bg-li-accent-blue flex items-center justify-center border-2 border-li-ink-dark text-white">
                                 <span className="material-symbols-outlined">rocket_launch</span>
                              </div>
                              <div className="space-y-2">
                                 <h4 className="font-bold text-lg uppercase">Tool Execution</h4>
                                 <p className="text-sm">Sandboxed environments for Python, Node.js, and browser automation.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

             {/* Footer CTA */}
             <section className="w-full py-24 flex justify-center bg-li-ink-dark text-li-bg-light relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSmB0vHIiv_oXLIsUAakYr0HO8C9ogw7zDHNDB1SKz1Z-AvqjIQhOqnCKiUce-sKcu512mfS1Fhdi6GOKhlNPjU6uPQxEwMnRcunJgKzEte2JGj8TQUVZNt1GCrLswfgPyK3lXIRF8r_B9cP5sX1e9jcV2waLGfYg3gHXh_vCkdujBAN16WuNAKxmBIbjVYUvyZzquaLyLlQ0rrQD7SKTh6qPLKg_syQuXGfK2DcH4-jivzJoDoftyANt-8qtVUvbTebLXmTQJQdk")'}}></div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight">System Ready</h2>
                    <p className="text-xl opacity-80 font-mono">Begin the integration of autonomous agents into your infrastructure.</p>
                    
                    <div className="w-full max-w-lg mx-auto mt-8 group">
                       <div className="relative bg-black border border-gray-700 rounded p-1 flex items-center shadow-2xl">
                           <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] text-gray-500 font-mono">BASH</div>
                           <div className="flex-1 flex items-center px-4 h-14 font-mono text-sm md:text-base">
                               <span className="text-li-primary mr-3 select-none">$</span>
                               <input className="bg-transparent border-none text-gray-200 w-full focus:ring-0 p-0 cursor-text" readOnly type="text" value="npm install orchestra-os"/>
                           </div>
                           <button onClick={handleCopy} className="h-10 px-6 bg-gray-800 hover:bg-gray-700 text-white font-medium text-sm transition-colors rounded-sm flex items-center gap-2 border border-gray-600">
                               <span className="material-symbols-outlined text-base">content_copy</span>
                               <span className="hidden sm:inline">COPY</span>
                           </button>
                       </div>
                   </div>
                </div>
            </section>
          </main>
          
          <div className="fixed bottom-8 right-8 z-50 group">
             <button onClick={onLaunch} className="relative bg-[#d65d0e] hover:bg-[#cc241d] text-li-ink-dark font-black uppercase tracking-widest text-sm py-4 pl-6 pr-16 border-b-[6px] border-r-[6px] border-li-ink-dark active:border-b-0 active:border-r-0 active:translate-y-[6px] active:translate-x-[6px] transition-all rounded-sm flex items-center">
               <span>Launch OS</span>
               <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-6 bg-li-ink-dark rounded-full p-1 transition-colors">
                  <div className="w-4 h-4 bg-li-bg-light rounded-full shadow-md transform translate-x-4 transition-transform"></div>
               </div>
             </button>
             <div className="absolute -top-8 right-0 bg-li-ink-dark text-li-bg-light text-[10px] px-2 py-1 font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Click to Initialize
             </div>
          </div>
        </div>
      ) : (
        // DARK MODE LAYOUT (Technical Blueprint)
        <div className="font-display overflow-x-hidden selection:bg-lp-primary selection:text-white relative">
          <div className="fixed inset-0 pointer-events-none blueprint-grid z-0"></div>
          
          <header className="w-full border-b border-lp-border-dark bg-lp-bg-dark/90 backdrop-blur-sm sticky top-0 z-40">
             <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer">
                   <div className="w-8 h-8 bg-lp-primary flex items-center justify-center text-lp-bg-dark">
                      <span className="material-symbols-outlined text-xl">hub</span>
                   </div>
                   <span className="font-bold text-lg tracking-tighter uppercase text-white">Orchestra<span className="text-lp-primary">OS</span></span>
                   <span className="px-2 py-0.5 bg-gb-purple/20 border border-gb-purple text-gb-purple text-[9px] font-bold uppercase tracking-[0.15em] font-mono animate-pulse">PROTOTYPE</span>
                </div>
                <nav className="hidden md:flex items-center gap-10">
                   <button onClick={() => setShowInfoModal('features')} className="text-sm font-medium text-gray-400 hover:text-lp-primary transition-colors relative group">// FEATURES</button>
                   <button onClick={onViewDocs} className="text-sm font-medium text-gray-400 hover:text-lp-primary transition-colors relative group">// DOCS</button>
                   <button onClick={onViewTerminal} className="text-sm font-medium text-gray-400 hover:text-lp-primary transition-colors relative group">// TERMINAL</button>
                </nav>
                <div className="flex items-center gap-4">
                   <div className="hidden lg:block text-[10px] text-gray-500 font-mono">SYS.STATUS: NOMINAL</div>
                   <button onClick={onLaunch} className="bg-lp-primary hover:bg-white hover:text-lp-bg-dark text-lp-bg-dark font-bold text-sm px-5 py-2 transition-all uppercase tracking-wide">
                      Get Access
                   </button>
                </div>
             </div>
          </header>

          <main className="flex-grow flex flex-col justify-center relative py-20 px-6 max-w-7xl mx-auto w-full z-10">
             <div className="absolute top-10 left-10 text-[10px] text-gray-600 font-mono hidden lg:block">
                COORD: 44.23.11<br/>
                SECTOR: ALPHA-9
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 flex flex-col gap-8 relative z-20 order-2 lg:order-1">
                   <div className="relative">
                      <div className="absolute -left-6 top-2 w-1 h-20 bg-lp-primary/50 hidden lg:block"></div>
                      <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tighter uppercase text-white">
                         Architect <br/>
                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">The Intelligence</span> <br/>
                         Layer.
                      </h1>
                   </div>
                   <p className="text-gray-400 text-lg md:text-xl max-w-md border-l border-gray-700 pl-4">
                      Orchestra OS is the blueprint for agentic workflows. Define, deploy, and manage your agentic networks with precision.
                   </p>
                   <div className="flex flex-wrap gap-4 pt-4">
                      <button onClick={onLaunch} className="group relative px-6 py-3 bg-transparent border-2 border-lp-primary text-lp-primary font-bold uppercase tracking-wider hover:bg-lp-primary hover:text-lp-bg-dark transition-all overflow-hidden">
                         <span className="relative z-10 flex items-center gap-2">
                            Start Building 
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                         </span>
                      </button>
                      <button onClick={onViewDocs} className="px-6 py-3 bg-lp-surface-dark border border-lp-border-dark text-gray-300 font-medium uppercase tracking-wider hover:bg-lp-border-dark transition-all">
                         Read The Specs
                      </button>
                   </div>
                   <div className="font-mono text-xs text-lp-primary mt-8">
                      &gt; RECENT_BUILD: v2.4.0-stable initialized...
                   </div>
                </div>

                <div className="lg:col-span-7 relative h-[500px] w-full order-1 lg:order-2 border border-lp-border-dark/30 bg-lp-bg-dark/30 backdrop-blur-sm group select-none">
                   {/* Tech markers */}
                   <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-lp-primary"></div>
                   <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-lp-primary"></div>
                   <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-lp-primary"></div>
                   <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-lp-primary"></div>
                   
                   <svg className="w-full h-full" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="#473624" strokeWidth="2">
                         <line x1="300" x2="150" y1="200" y2="100"></line>
                         <line x1="300" x2="450" y1="200" y2="100"></line>
                         <line x1="300" x2="150" y1="200" y2="300"></line>
                         <line x1="300" x2="450" y1="200" y2="300"></line>
                         <line strokeDasharray="4" x1="150" x2="80" y1="100" y2="150"></line>
                         <line strokeDasharray="4" x1="450" x2="520" y1="100" y2="150"></line>
                         <line strokeDasharray="4" x1="450" x2="450" y1="300" y2="360"></line>
                         <line strokeDasharray="4" x1="150" x2="80" y1="300" y2="350"></line>
                      </g>
                      <g className="group/node cursor-pointer">
                         <circle className="node" cx="300" cy="200" fill="#2c2219" r="25" stroke="#e68019" strokeWidth="2"></circle>
                         <text fill="#e68019" fontFamily="Space Grotesk" fontSize="10" fontWeight="bold" textAnchor="middle" x="300" y="205">HUB</text>
                      </g>
                      <circle className="node" cx="150" cy="100" fill="#211911" r="12" stroke="#654d34" strokeWidth="2"></circle>
                      <circle className="node" cx="450" cy="100" fill="#211911" r="12" stroke="#654d34" strokeWidth="2"></circle>
                      <circle className="node" cx="150" cy="300" fill="#211911" r="12" stroke="#654d34" strokeWidth="2"></circle>
                      <circle className="node" cx="450" cy="300" fill="#211911" r="12" stroke="#654d34" strokeWidth="2"></circle>
                      <text fill="#666" fontFamily="monospace" fontSize="10" x="335" y="195">ID: MAIN_01</text>
                      <text fill="#666" fontFamily="monospace" fontSize="10" x="470" y="90">AGENT_X</text>
                      <text fill="#666" fontFamily="monospace" fontSize="10" x="100" y="90">AGENT_Y</text>
                   </svg>
                   
                   <div className="absolute bottom-4 right-4 bg-black/80 border border-lp-primary/30 p-2 text-[10px] font-mono text-lp-primary">
                      <div>NODES: 9</div>
                      <div>EDGES: 12</div>
                      <div className="animate-pulse">STATUS: ACTIVE</div>
                   </div>
                </div>
             </div>
          </main>
          
          <section className="py-20 px-6 border-t border-lp-border-dark bg-lp-bg-dark relative">
            <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group relative bg-lp-surface-dark border-2 border-lp-border-dark p-8 hover:border-lp-primary transition-colors duration-300">
                     <div className="absolute top-4 right-4 font-mono text-xs text-gray-600 group-hover:text-lp-primary transition-colors">[MOD_01]</div>
                     <div className="mb-6 w-12 h-12 bg-lp-bg-dark border border-lp-border-dark flex items-center justify-center text-lp-primary group-hover:bg-lp-primary group-hover:text-lp-bg-dark transition-colors">
                        <span className="material-symbols-outlined">dns</span>
                     </div>
                     <h3 className="text-xl font-bold uppercase mb-3 text-white">Deployment</h3>
                     <p className="text-gray-400 text-sm leading-relaxed mb-6">One-click ship. Deploy your agent swarms to edge locations.</p>
                     <div className="w-full h-1 bg-lp-bg-dark overflow-hidden">
                        <div className="h-full w-2/3 bg-gray-700 group-hover:bg-lp-primary transition-colors"></div>
                     </div>
                  </div>
                  <div className="group relative bg-lp-surface-dark border-2 border-lp-border-dark p-8 hover:border-lp-primary transition-colors duration-300">
                     <div className="absolute top-4 right-4 font-mono text-xs text-gray-600 group-hover:text-lp-primary transition-colors">[MOD_02]</div>
                     <div className="mb-6 w-12 h-12 bg-lp-bg-dark border border-lp-border-dark flex items-center justify-center text-lp-primary group-hover:bg-lp-primary group-hover:text-lp-bg-dark transition-colors">
                        <span className="material-symbols-outlined">camera_enhance</span>
                     </div>
                     <h3 className="text-xl font-bold uppercase mb-3 text-white">Snapshot</h3>
                     <p className="text-gray-400 text-sm leading-relaxed mb-6">Capture full system states instantly for debugging.</p>
                     <div className="w-full h-1 bg-lp-bg-dark overflow-hidden">
                        <div className="h-full w-1/3 bg-gray-700 group-hover:bg-lp-primary transition-colors"></div>
                     </div>
                  </div>
               </div>
            </div>
          </section>

           <section className="py-24 px-6 relative overflow-hidden">
               <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-lp-surface-dark to-transparent opacity-50"></div>
               <div className="max-w-4xl mx-auto relative z-10">
                   <div className="flex flex-col items-center text-center gap-8">
                       <div className="inline-flex items-center gap-2 px-3 py-1 border border-lp-primary/30 rounded-full bg-lp-primary/10 text-lp-primary text-xs font-mono uppercase">
                           <span className="w-2 h-2 rounded-full bg-lp-primary animate-pulse"></span>
                           Ready for initialization
                       </div>
                       <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">Initialize System</h2>
                       
                       <div className="w-full max-w-lg mt-4 group">
                           <div className="relative bg-black border border-gray-700 rounded p-1 flex items-center shadow-2xl">
                               <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] text-gray-500 font-mono">BASH</div>
                               <div className="flex-1 flex items-center px-4 h-14 font-mono text-sm md:text-base">
                                   <span className="text-lp-primary mr-3 select-none">$</span>
                                   <input className="bg-transparent border-none text-gray-200 w-full focus:ring-0 p-0 cursor-text" readOnly type="text" value="npm install orchestra-os"/>
                               </div>
                               <button onClick={handleCopy} className="h-10 px-6 bg-gray-800 hover:bg-gray-700 text-white font-medium text-sm transition-colors rounded-sm flex items-center gap-2 border border-gray-600">
                                   <span className="material-symbols-outlined text-base">content_copy</span>
                                   <span className="hidden sm:inline">COPY</span>
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           </section>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 font-sans"
          onClick={() => setShowInfoModal(null)}
        >
          <div
            className={`max-w-2xl w-full p-8 ${
              isLightMode
                ? 'bg-li-bg-light border-4 border-li-ink-dark'
                : 'bg-lp-bg-dark border-4 border-lp-primary'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-3xl font-display font-bold uppercase tracking-tight ${
                  isLightMode ? 'text-li-ink-dark' : 'text-white'
                }`}
              >
                {infoModals[showInfoModal].title}
              </h2>
              <button
                onClick={() => setShowInfoModal(null)}
                className={`w-10 h-10 flex items-center justify-center transition-colors ${
                  isLightMode
                    ? 'text-li-ink-dark hover:bg-li-ink-dark hover:text-li-bg-light'
                    : 'text-lp-primary hover:bg-lp-primary hover:text-lp-bg-dark'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <p
              className={`text-lg leading-relaxed mb-8 ${
                isLightMode ? 'text-li-ink-dark/80' : 'text-gray-300'
              }`}
            >
              {infoModals[showInfoModal].content}
            </p>
            <div className="flex gap-4">
              <button
                onClick={onLaunch}
                className={`flex-1 py-3 font-bold uppercase tracking-wider transition-colors ${
                  isLightMode
                    ? 'bg-li-ink-dark text-li-bg-light hover:bg-li-primary border-2 border-li-ink-dark'
                    : 'bg-lp-primary text-lp-bg-dark hover:bg-white'
                }`}
              >
                Launch Dashboard
              </button>
              <button
                onClick={() => setShowInfoModal(null)}
                className={`flex-1 py-3 font-bold uppercase tracking-wider transition-colors ${
                  isLightMode
                    ? 'border-2 border-li-ink-dark text-li-ink-dark hover:bg-li-ink-dark hover:text-li-bg-light'
                    : 'border-2 border-lp-primary text-lp-primary hover:bg-lp-primary hover:text-lp-bg-dark'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
