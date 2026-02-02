import React from 'react';
import { LogEntry } from '../../types';

interface RightSidebarProps {
  logs: LogEntry[];
}

const RightSidebar: React.FC<RightSidebarProps> = ({ logs }) => {
  return (
    <aside className="hidden xl:flex w-80 border-l-6 border-gb-bg0 bg-gb-bg-h flex-col z-20">
      <div className="p-6 border-b-4 border-gb-bg0 bg-gb-bg0">
        <h4 className="text-xl font-display font-bold uppercase tracking-tighter text-gb-orange">System Logs</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-1.5 h-1.5 bg-gb-red rounded-full animate-pulse"></span>
          <p className="text-[9px] font-bold uppercase text-gb-gray tracking-widest">Live Telemetry Feed</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[10px] bg-black/20 custom-scrollbar">
        {logs.map((log) => (
          <div key={log.id} className={`p-2 border-b border-gb-bg0/50 ${log.level === 'FAT' ? 'bg-gb-red/10' : ''}`}>
            <span className={`font-bold ${log.level === 'ERR' || log.level === 'FAT' ? 'text-gb-red' : log.level === 'WRN' ? 'text-gb-yellow' : log.level === 'SYS' ? 'text-gb-aqua' : 'text-gb-blue'}`}>
              [{log.timestamp}]
            </span>
            <p className={`${log.level === 'FAT' ? 'text-gb-red font-bold' : 'text-gb-fg/70'} mt-1`}>
              {log.source}: {log.message}
            </p>
          </div>
        ))}
      </div>
      <div className="p-6 bg-gb-bg0 border-t-4 border-gb-bg-h">
        <div className="flex items-center justify-between text-gb-fg mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest">Network Load</span>
          <span className="font-display font-bold text-gb-aqua">42.0%</span>
        </div>
        <div className="h-3 w-full bg-gb-bg-h border-2 border-gb-bg0 relative overflow-hidden">
          <div className="h-full bg-gb-aqua transition-all duration-500" style={{ width: '42%' }}></div>
        </div>
        <div className="flex justify-between mt-2 text-[8px] text-gb-gray font-bold">
          <span>0MBPS</span><span>500MBPS</span><span>1GBPS</span>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
