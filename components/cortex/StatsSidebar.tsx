import React from 'react';

const StatsSidebar: React.FC = () => {
  return (
    <div className="w-80 border-l border-gb-bg2 bg-gb-bg1 flex flex-col h-full font-mono text-xs">
        {/* Section 1: Analysis */}
        <div className="p-4 border-b border-gb-bg2">
            <h3 className="text-gb-gray font-bold uppercase tracking-widest mb-4 text-[10px]">CLUSTER_ANALYSIS</h3>
            
            <div className="space-y-4">
                <div className="bg-gb-bg0 p-3 border border-gb-bg2 relative overflow-hidden group">
                    <div className="text-[9px] text-gb-gray uppercase mb-1">ENTROPY_INDEX</div>
                    <div className="text-2xl font-display font-bold text-gb-orange">0.1429</div>
                    <div className="h-1 bg-gb-bg2 mt-2 overflow-hidden">
                        <div className="h-full bg-gb-orange w-[14%]" />
                    </div>
                </div>

                <div className="bg-gb-bg0 p-3 border border-gb-bg2 relative overflow-hidden group">
                    <div className="text-[9px] text-gb-gray uppercase mb-1">TOKEN_VELOCITY</div>
                    <div className="text-2xl font-display font-bold text-gb-green">1.2k/s</div>
                    <div className="h-1 bg-gb-bg2 mt-2 overflow-hidden">
                        <div className="h-full bg-gb-green w-[75%] animate-pulse" />
                    </div>
                </div>
            </div>
        </div>

        {/* Section 2: Protocols */}
        <div className="p-4 border-b border-gb-bg2 flex-1">
            <h3 className="text-gb-gray font-bold uppercase tracking-widest mb-4 text-[10px]">LIVE_PROTOCOLS</h3>
            <ul className="space-y-2 text-[10px] text-gb-fg">
                <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[10px] text-gb-green">check_circle</span>
                    P_LAYER_RECOVERY
                </li>
                <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[10px] text-gb-yellow animate-spin">sync</span>
                    H_SYNC_V3
                </li>
                <li className="flex items-center gap-2 opacity-50">
                    <span className="material-symbols-outlined text-[10px]">radio_button_unchecked</span>
                    M_LEARN_AUTO
                </li>
            </ul>
        </div>

        {/* Section 3: System Health */}
        <div className="p-4 border-t border-gb-bg2 bg-gb-bg0">
            <div className="flex justify-between items-end mb-2">
                <span className="text-[9px] text-gb-gray uppercase font-bold">SYSTEM_HEALTH</span>
                <span className="text-[9px] text-gb-fg uppercase font-bold">NOMINAL</span>
            </div>
            {/* Fake bar chart */}
            <div className="flex h-8 gap-[2px] items-end opacity-80">
                {[4, 6, 3, 7, 5, 8, 4, 6, 9, 5, 3, 6, 8, 4, 7, 9, 6, 5, 8, 9].map((h, i) => (
                    <div 
                        key={i} 
                        style={{ height: `${h * 10}%` }}
                        className={`flex-1 ${h > 7 ? 'bg-gb-green' : 'bg-gb-yellow'}`} 
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

export default StatsSidebar;
