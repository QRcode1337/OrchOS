import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../../types';

interface ConsoleLogsProps {
  logs: LogEntry[];
}

const ConsoleLogs: React.FC<ConsoleLogsProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-gb-bg0 relative overflow-hidden">
      {/* Header */}
      <div className="h-8 border-b border-gb-bg2 flex items-center justify-between px-4 shrink-0 bg-gb-bg1">
          <span className="text-xs font-bold text-gb-fg font-mono uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gb-red animate-pulse"/>
              [ VERBOSE_LOGS_STREAM ]
          </span>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-gb-yellow/20"/>
            <span className="w-2 h-2 rounded-full bg-gb-yellow/20"/>
            <span className="w-2 h-2 rounded-full bg-gb-yellow/20"/>
          </div>
      </div>

      {/* Logs Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar font-mono text-[11px] leading-relaxed">
          {logs.map((log) => (
            <div key={log.id} className="group flex gap-3 hover:bg-gb-bg1/40 px-2 py-0.5 rounded-sm transition-colors border-l-2 border-transparent hover:border-gb-gray/30">
              <span className="text-gb-gray/50 shrink-0 select-none">
                {log.timestamp}
              </span>
              <span className={`shrink-0 w-16 font-bold ${
                 log.level === 'INF' ? 'text-gb-blue' : 
                 log.level === 'WRN' ? 'text-gb-yellow' : 
                 log.level === 'ERR' ? 'text-gb-red' : 
                 log.level === 'FAT' ? 'text-gb-red underline' : 
                 log.level === 'SYS' ? 'text-gb-purple' : 'text-gb-orange'
              }`}>
                [{log.level}]
              </span>
              <span className={`shrink-0 font-bold ${
                  log.source === 'SYSTEM' ? 'text-gb-gray' : 'text-gb-fg'
              }`}>
                  {log.source}:
              </span>
              <span className="text-gb-fg/80 break-all group-hover:text-gb-fg">
                {log.message}
              </span>
            </div>
          ))}
          {/* Terminal Cursor at the end */}
          <div className="ml-2 mt-2 w-2 h-4 bg-gb-gray/50 animate-pulse"/>
      </div>
    </div>
  );
};

export default ConsoleLogs;
