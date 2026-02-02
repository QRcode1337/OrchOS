import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../../types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface LogStreamProps {
  logs: LogEntry[];
  commandValue: string;
  onCommandChange: (value: string) => void;
  onCommandSubmit: (e: React.FormEvent) => void;
}

const LogStream: React.FC<LogStreamProps> = ({ 
  logs, 
  commandValue, 
  onCommandChange, 
  onCommandSubmit 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section className="flex-1 flex flex-col border-r border-bg2 bg-bg0">
      <div className="px-4 py-2 bg-bg1 border-b border-bg2 flex justify-between items-center">
        <h2 className="text-xs font-bold text-fg1 flex items-center gap-2 font-mono">
          <span className="material-symbols-outlined text-sm">terminal</span>
          SYSTEM_LOG_STREAM
        </h2>
        <div className="flex gap-4 text-[10px] text-gray uppercase font-mono">
          <span>Filter: ALL_EVENTS</span>
          <span>Rate: 124ms</span>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar text-[13px] leading-relaxed space-y-1 font-cli"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 group hover:bg-bg1/30 px-2 rounded">
            <span className="text-gray flex-shrink-0">[{log.timestamp}]</span>
            <span className={`flex-shrink-0 w-16 ${
               log.level === 'INF' ? 'text-blue' : 
               log.level === 'WRN' ? 'text-yellow' : 
               log.level === 'ERR' ? 'text-red' : 
               log.level === 'FAT' ? 'text-red font-bold' : 
               log.level === 'SYS' ? 'text-purple' : 'text-orange'
            }`}>
              {log.level === 'SYS' ? 'SYS_EVT' : 
               log.level === 'FAT' ? 'FAT_ERR' : 
               log.level === 'INF' ? 'LOG_INF' :
               log.level + '_MSG'}
            </span>
            <p className="text-fg1 opacity-90 break-all">
              <span className={`${
                 log.level === 'INF' ? 'text-aqua' : 
                 log.level === 'WRN' ? 'text-yellow' : 
                 log.level === 'FAT' ? 'text-red' : 
                 'text-fg1'
              }`}>{log.source}:</span> {log.message}
            </p>
          </div>
        ))}
        
        <form onSubmit={onCommandSubmit} className="flex gap-2 pt-4 px-2 items-center">
          <span className="text-green font-bold shrink-0">root@orchestra:~#</span>
          <input
            type="text"
            value={commandValue}
            onChange={(e) => onCommandChange(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-fg1 font-cli p-0 m-0"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>

      <div className="p-4 border-t border-bg2 bg-bg1/30 min-h-[120px]">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] text-gray uppercase font-bold">Throughput_Overview_Global</span>
          <span className="text-[10px] text-green font-bold">SYNC_STABLE</span>
        </div>
        <div className="h-20 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
                {v: 20}, {v: 40}, {v: 30}, {v: 70}, {v: 40}, {v: 60}, {v: 30}, {v: 80}, {v: 50}, {v: 90}
            ]}>
                <Area type="monotone" dataKey="v" stroke="#83a598" fill="#83a598" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default LogStream;
