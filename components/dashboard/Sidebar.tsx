import React from 'react';
import { ViewMode } from '../../types';

interface SidebarProps {
  /** Currently active view for highlighting */
  currentView: ViewMode;
  /** Callback to navigate between views */
  onViewChange: (view: ViewMode) => void;
  /** Callback for NEW_DEPLOYMENT button */
  onDeploy?: () => void;
}

/**
 * Sidebar - Agent-themed navigation sidebar.
 *
 * Features:
 * - Three navigation items styled as agent cards (NEXUS-07, VOID-ANALYZER, LOGIC-GATE)
 * - Color-coded status bars for each nav item
 * - NEW_DEPLOYMENT button at bottom
 * - Responsive width (20px on mobile, 64px on desktop)
 *
 * Wrapped with React.memo to prevent unnecessary re-renders.
 */
const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onDeploy }) => {
  return (
    <aside className="w-20 md:w-64 border-r-6 border-gb-bg0 bg-gb-bg0 flex flex-col justify-between py-6 h-full z-20 transition-all">
      <div className="flex flex-col w-full h-full px-4 gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-gb-gray/20 pb-4 mt-2">
            <h1 className="text-xl font-display font-bold italic text-gb-green tracking-tighter">CORTEX_DEV</h1>
            <div className="bg-gb-bg-h px-2 py-1 text-[10px] font-mono text-gb-gray border border-gb-gray/30">QTY: 03</div>
        </div>

        <nav className="flex flex-col gap-4">
          
          {/* Item 1: SQUAD UNITS (Dashboard) */}
          <button 
            onClick={() => onViewChange('dashboard')}
            className={`group relative w-full border-2 transition-all p-1 text-left ${currentView === 'dashboard' ? 'border-gb-green bg-gb-bg-h' : 'border-gb-gray/30 bg-gb-bg0 hover:border-gb-gray'}`}
          >
             <div className="flex gap-3 items-center p-2">
                 <div className={`w-12 h-12 flex items-center justify-center border-2 ${currentView === 'dashboard' ? 'bg-gb-fg border-gb-fg' : 'bg-gb-bg-h border-gb-gray'} transition-colors`}>
                     <span className={`material-symbols-outlined ${currentView === 'dashboard' ? 'text-gb-bg0' : 'text-gb-gray'} text-2xl`}>view_cozy</span>
                 </div>
                 <div className="flex-1 min-w-0">
                     <div className={`font-display font-bold uppercase text-lg leading-none mb-1 ${currentView === 'dashboard' ? 'text-gb-fg' : 'text-gb-gray'}`}>NEXUS-07</div>
                     
                     {/* Status Bar */}
                     <div className="flex gap-0.5 h-3 w-full mb-1 opacity-80">
                         <div className={`flex-1 ${currentView === 'dashboard' ? 'bg-gb-green' : 'bg-gb-gray/30'}`}></div>
                         <div className={`flex-1 ${currentView === 'dashboard' ? 'bg-gb-green' : 'bg-gb-gray/30'}`}></div>
                         <div className={`flex-1 ${currentView === 'dashboard' ? 'bg-gb-green' : 'bg-gb-gray/30'}`}></div>
                         <div className={`flex-1 ${currentView === 'dashboard' ? 'bg-gb-green/50' : 'bg-gb-gray/30'}`}></div>
                     </div>
                     <div className="text-[9px] font-mono text-gb-gray uppercase tracking-widest">STATUS: PROCESSING</div>
                 </div>
             </div>
          </button>

          {/* Item 2: VOID-ANALYZER */}
          <button 
            onClick={() => onViewChange('docs')}
            className={`group relative w-full border-2 transition-all p-1 text-left ${currentView === 'docs' ? 'border-gb-yellow bg-gb-bg-h' : 'border-gb-gray/30 bg-gb-bg0 hover:border-gb-gray'}`}
          >
             <div className="flex gap-3 items-center p-2">
                 <div className={`w-12 h-12 flex items-center justify-center border-2 ${currentView === 'docs' ? 'bg-gb-fg border-gb-fg' : 'bg-gb-bg-h border-gb-gray'} transition-colors`}>
                     <span className={`material-symbols-outlined ${currentView === 'docs' ? 'text-gb-bg0' : 'text-gb-gray'} text-2xl`}>grid_goldenratio</span>
                 </div>
                 <div className="flex-1 min-w-0">
                     <div className={`font-display font-bold uppercase text-lg leading-none mb-1 ${currentView === 'docs' ? 'text-gb-fg' : 'text-gb-gray'}`}>VOID-ANALYZER</div>
                     <div className="flex gap-0.5 h-3 w-full mb-1 opacity-80">
                         <div className={`flex-1 ${currentView === 'docs' ? 'bg-gb-yellow' : 'bg-gb-gray/30'}`}></div>
                         <div className={`flex-1 ${currentView === 'docs' ? 'bg-gb-yellow' : 'bg-gb-gray/30'}`}></div>
                         <div className="flex-1 bg-gb-gray/30"></div>
                         <div className="flex-1 bg-gb-gray/30"></div>
                     </div>
                     <div className="text-[9px] font-mono text-gb-gray uppercase tracking-widest">STATUS: STANDBY</div>
                 </div>
             </div>
          </button>

          {/* Item 3: LOGIC-GATE (CLI) */}
           <button 
            onClick={() => onViewChange('cli')}
            className={`group relative w-full border-2 transition-all p-1 text-left ${currentView === 'cli' ? 'border-gb-red bg-gb-bg-h' : 'border-gb-gray/30 bg-gb-bg0 hover:border-gb-gray'}`}
          >
             <div className="flex gap-3 items-center p-2">
                 <div className={`w-12 h-12 flex items-center justify-center border-2 ${currentView === 'cli' ? 'bg-gb-fg border-gb-fg' : 'bg-gb-bg-h border-gb-gray'} transition-colors`}>
                     <span className={`material-symbols-outlined ${currentView === 'cli' ? 'text-gb-bg0' : 'text-gb-gray'} text-2xl`}>terminal</span>
                 </div>
                 <div className="flex-1 min-w-0">
                     <div className={`font-display font-bold uppercase text-lg leading-none mb-1 ${currentView === 'cli' ? 'text-gb-fg' : 'text-gb-gray'}`}>LOGIC-GATE</div>
                     <div className="flex gap-0.5 h-3 w-full mb-1 opacity-80">
                         <div className="flex-1 bg-gb-red"></div>
                         <div className="flex-1 bg-gb-red"></div>
                         <div className="flex-1 bg-gb-red"></div>
                         <div className="flex-1 bg-gb-red"></div>
                     </div>
                     <div className="text-[9px] font-mono text-gb-red uppercase tracking-widest animate-pulse">STATUS: CRITICAL_ERR</div>
                 </div>
             </div>
          </button>

        </nav>

        <div className="mt-auto pb-4">
             <button 
              onClick={onDeploy}
              className="w-full bg-gb-fg text-gb-bg0 font-display font-bold uppercase text-lg py-3 border-2 border-gb-fg hover:bg-white hover:border-white transition-all shadow-[4px_4px_0px_0px_rgba(29,32,33,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(29,32,33,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2"
            >
              <span>NEW_DEPLOYMENT</span>
            </button>
        </div>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
