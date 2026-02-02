import React, { useState } from 'react';
import LogStream from '../components/cli/LogStream';
import { LogEntry, ViewMode, Agent } from '../types';
import { CLI_COMMANDS } from '../constants';

interface CLIProps {
    onViewChange: (view: ViewMode) => void;
    logs: LogEntry[];
    agents: Agent[];
}

const CLI: React.FC<CLIProps> = ({ onViewChange, logs: initialLogs, agents }) => {
    const [command, setCommand] = useState('');
    const [localLogs, setLocalLogs] = useState<LogEntry[]>(initialLogs);

    const addLog = (message: string, source = 'SYSTEM', level: LogEntry['level'] = 'INF') => {
        const newLog: LogEntry = {
            id: (Date.now() + Math.random()).toString(),
            timestamp: new Date().toLocaleTimeString([], { hour12: false }),
            source,
            level,
            message
        };
        setLocalLogs(prev => [...prev, newLog]);
    };

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim()) return;

        const cmd = command.trim().toLowerCase();
        addLog(`> ${command}`, 'CLI', 'SYS');

        if (cmd === '/agents') {
            const agentList = agents.map(a => `${a.name} [${a.status}]`).join(', ');
            addLog(`Active Units: ${agentList}`);
        } else if (cmd.startsWith('/memory')) {
            const agentId = cmd.split(' ')[1];
            const agent = agents.find(a => a.id === agentId || a.name.toLowerCase().includes(agentId));
            if (agent) {
                addLog(`Accessing Memory for ${agent.name}...`, 'VAULT', 'INF');
                const memCount = (agent as any).memories?.length || 0;
                addLog(`Found ${memCount} disparate artifacts stored in local cache.`);
            } else {
                addLog(`Error: Agent "${agentId}" not found. Try /agents for a list.`, 'SYS', 'ERR');
            }
        } else if (cmd === '/synthesize') {
            addLog('Initiating Knowledge Convergence...', 'CORTEX', 'INF');
            setTimeout(() => onViewChange('synthesis'), 1500);
        } else if (cmd === '/clear') {
            setLocalLogs([]);
        } else if (cmd === '/help') {
            addLog('Available: /agents, /memory [id], /synthesize, /clear, /help');
        } else {
            addLog(`Unknown command: "${cmd}". Type /help for assistance.`, 'SYS', 'WRN');
        }

        setCommand('');
    };

    return (
        <div className="min-h-screen flex flex-col overflow-hidden selection:bg-fg1 selection:text-bg0 bg-bg0 text-fg0 font-cli">
      <header className="flex items-center justify-between px-4 py-2 bg-bg1 border-b-2 border-bg2 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-aqua font-bold uppercase tracking-tighter">Orchestra OS v4.2.0</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-gray font-mono">
            <span>[ NODE: AMSTERDAM-042 ]</span>
            <span className="text-green">● SYSTEM ONLINE</span>
          </div>
        </div>
        <div className="flex items-center gap-6 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-gray">TOKENS:</span>
            <span className="text-blue">1.2M</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray">TASKS:</span>
            <span className="text-yellow">24</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray">COST:</span>
            <span className="text-red">$142.50</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
         {/* Floating Nav for View Switching in CLI Mode */}
        <nav className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6 p-2 bg-bg1 border border-l-0 border-bg2 rounded-r-md z-50 shadow-lg">
            <button onClick={() => onViewChange('dashboard')} className="text-gray hover:text-aqua transition-colors" title="Dashboard">
                <span className="material-symbols-outlined text-xl">grid_view</span>
            </button>
            <button className="text-gray hover:text-aqua transition-colors" title="Agents">
                <span className="material-symbols-outlined text-xl">smart_toy</span>
            </button>
            <button className="text-aqua" title="Logs">
                <span className="material-symbols-outlined text-xl">terminal</span>
            </button>
            <button className="text-gray hover:text-aqua transition-colors" title="Settings">
                <span className="material-symbols-outlined text-xl">settings</span>
            </button>
        </nav>

        <LogStream 
            logs={localLogs} 
            commandValue={command} 
            onCommandChange={setCommand} 
            onCommandSubmit={handleCommand} 
        />

        <aside className="w-96 flex flex-col bg-bg1 border-l border-bg2 hidden lg:flex">
          {/* Active Agents Section */}
          <div className="flex-1 flex flex-col min-h-0 border-b border-bg2">
            <div className="px-4 py-2 bg-bg2 border-b border-bg2 flex justify-between items-center shrink-0">
                <h2 className="text-xs font-bold text-fg1 flex items-center gap-2 font-mono">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
                ACTIVE_AGENTS
                </h2>
                <button className="text-[10px] border border-gray px-2 py-0.5 hover:bg-bg2 text-gray font-mono">VIEW_ALL</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {agents.map((agent: Agent) => (
                    <div key={agent.id} className={`bg-bg0 border p-4 flex flex-col gap-3 group transition-all ${agent.status === 'ERROR' ? 'border-red/40' : 'border-bg2 hover:border-gray'}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 bg-bg1 border border-bg2 flex items-center justify-center font-bold font-display text-xl ${
                                    agent.color === 'blue' ? 'text-blue' : agent.color === 'yellow' ? 'text-yellow' : 'text-red'
                                }`}>
                                    {agent.color === 'blue' ? 'Σ' : agent.color === 'yellow' ? '∅' : 'Δ'}
                                </div>
                                <div>
                                    <h3 className={`text-sm font-bold tracking-tight font-mono ${
                                        agent.color === 'blue' ? 'text-blue' : agent.color === 'yellow' ? 'text-yellow' : 'text-red'
                                    }`}>{agent.name}</h3>
                                    <p className="text-[10px] text-gray font-mono">{agent.version}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                    agent.status === 'RUNNING' ? 'bg-green animate-pulse' : 
                                    agent.status === 'ERROR' ? 'bg-red' : 'bg-yellow'
                                }`}></span>
                                <span className={`text-[10px] font-bold font-mono ${
                                    agent.status === 'RUNNING' ? 'text-green' : 
                                    agent.status === 'ERROR' ? 'text-red' : 'text-yellow'
                                }`}>{agent.status}</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-fg1 opacity-80 leading-snug font-mono line-clamp-2">"{agent.message}"</p>
                        <div className="flex gap-2 pt-2 border-t border-bg2/50 font-mono">
                            <button className="flex-1 bg-bg1 hover:bg-bg2 py-1 text-[10px] font-bold transition-colors">CMD</button>
                            <button className="px-3 bg-bg1 hover:bg-red hover:text-bg0 py-1 text-[10px] font-bold uppercase transition-colors">
                                KILL
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Available Commands Section */}
          <div className="h-1/3 flex flex-col bg-bg1 min-h-[150px]">
             <div className="px-4 py-2 bg-bg2 border-b border-bg2 flex justify-between items-center shrink-0">
                <h2 className="text-xs font-bold text-fg1 flex items-center gap-2 font-mono">
                <span className="material-symbols-outlined text-sm">terminal</span>
                AVAILABLE_COMMANDS
                </h2>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar font-mono">
                {CLI_COMMANDS.map((cmd, idx) => (
                    <div key={idx} className="flex flex-col gap-1 p-2 hover:bg-bg0/50 cursor-pointer border border-transparent hover:border-bg2/50 group">
                        <code className="text-[11px] text-aqua font-bold group-hover:text-green">{cmd.cmd}</code>
                        <span className="text-[10px] text-gray">{cmd.desc}</span>
                    </div>
                ))}
             </div>
          </div>
          
          <div className="mt-auto p-4 border-t border-bg2 bg-bg0 shrink-0">
            <div className="flex justify-between text-[10px] font-bold text-fg1 mb-2 font-mono">
                <span className="uppercase">Network Load</span>
                <span className="text-blue">42%</span>
            </div>
            <div className="h-1.5 bg-bg2 overflow-hidden">
                <div className="h-full bg-blue transition-all duration-700" style={{ width: '42%' }}></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CLI;
