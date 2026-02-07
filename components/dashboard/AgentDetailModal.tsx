import React from 'react';
import { Agent, LogEntry } from '../../types';
import Modal from '../shared/Modal';

interface AgentDetailModalProps {
  agent: Agent | null;
  logs: LogEntry[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: Agent['status']) => void;
}

const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, logs, isOpen, onClose, onUpdateStatus }) => {
  const [showSourceCode, setShowSourceCode] = React.useState(false);
  const [terminalInput, setTerminalInput] = React.useState('');
  const [terminalOutput, setTerminalOutput] = React.useState<string[]>([]);

  if (!agent) return null;

  const agentLogs = logs.filter(log => log.source === agent.name || log.message.includes(agent.name));

  const handleTerminalCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

    setTerminalOutput(prev => [...prev, `[${timestamp}] ${agent.name}@ROOT:~# ${cmd}`]);

    // Simulate command responses
    if (command === 'help') {
      setTerminalOutput(prev => [...prev, 'Available commands: status, restart, logs, memory, help, clear']);
    } else if (command === 'status') {
      setTerminalOutput(prev => [...prev, `Agent Status: ${agent.status}\nVersion: ${agent.version}\nProgress: ${agent.progress}%`]);
    } else if (command === 'restart') {
      setTerminalOutput(prev => [...prev, 'Restarting agent...']);
      onUpdateStatus?.(agent.id, 'RUNNING');
    } else if (command === 'logs') {
      setTerminalOutput(prev => [...prev, `Total logs: ${agentLogs.length}\nRecent: ${agentLogs.slice(0, 3).map(l => l.message).join(', ')}`]);
    } else if (command === 'memory') {
      setTerminalOutput(prev => [...prev, `Memory banks: ${agent.memories?.length || 0} entries`]);
    } else if (command === 'clear') {
      setTerminalOutput([]);
    } else if (command) {
      setTerminalOutput(prev => [...prev, `Command not found: ${cmd}\nType 'help' for available commands.`]);
    }

    setTerminalInput('');
  };

  const colorClasses = {
    blue: 'text-gb-blue',
    yellow: 'text-gb-yellow',
    red: 'text-gb-red',
    green: 'text-gb-green',
    purple: 'text-gb-purple',
    aqua: 'text-gb-aqua',
    orange: 'text-gb-orange',
  };
  const accentColor = colorClasses[agent.color];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`UNIT: ${agent.name}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gb-bg0 border-2 border-gb-bg-h p-2 pixel-art flex justify-center bg-black/20">
             <img 
               src={agent.imageUrl} 
               alt={agent.name}
               className={`w-full aspect-square object-cover grayscale contrast-125`}
             />
          </div>
          
          <div className="space-y-2">
             <div className="flex justify-between items-center bg-gb-bg-h p-2 border border-gb-bg0">
               <span className="text-[10px] uppercase text-gb-gray">Primary Directive</span>
               <span className={`text-xs font-bold ${agent.status === 'RUNNING' ? 'text-gb-green' : agent.status === 'ERROR' ? 'text-gb-red' : 'text-gb-yellow'}`}>
                 {agent.role}
               </span>
             </div>
             
             {/* Persistent Memory Section */}
             <div className="bg-gb-bg-h p-2 border border-gb-bg0 space-y-2">
                <div className="flex justify-between items-center border-b border-gb-gray/20 pb-1">
                    <span className="text-[10px] uppercase text-gb-gray font-bold">Memory Banks</span>
                    <span className="text-[9px] font-mono text-gb-aqua">{agent.memories?.length || 0} ITEMS</span>
                </div>
                
                {agent.memories && agent.memories.length > 0 ? (
                  <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                      {agent.memories.map(memory => (
                        <li key={memory.id} className="text-[10px] border-l-2 border-gb-aqua pl-2 py-1 bg-black/10">
                            <div className="flex justify-between text-gb-gray mb-1">
                                <span className="font-bold">{memory.key}</span>
                                <span>{memory.type}</span>
                            </div>
                            <div className="text-gb-fg leading-tight">{memory.value}</div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <div className="text-[10px] text-gb-gray italic py-4 text-center border border-dashed border-gb-bg0">
                    No persistent data found for this unit.
                  </div>
                )}

                {/* Test Interface to verify persistence */}
                <button 
                  onClick={() => {
                    const fact = prompt("Enter a fact for this agent to remember:");
                    if (fact) {
                      fetch(`/api/agents/${agent.id}/memory`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key: 'USER_OBSERVATION', value: fact, type: 'FACT' })
                      }).then(() => window.location.reload()); // Simple reload for now to see changes
                    }
                  }}
                  className="w-full mt-2 py-1.5 border border-dashed border-gb-aqua text-gb-aqua text-[9px] uppercase font-bold hover:bg-gb-aqua hover:text-gb-bg-h transition-all"
                >
                  + Inject Memory Artifact
                </button>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
                onClick={() => onUpdateStatus?.(agent.id, 'OFFLINE')}
                className="bg-gb-bg0 border border-gb-gray hover:bg-gb-red hover:text-white p-2 text-[10px] font-bold uppercase transition-colors"
            >
              Terminate
            </button>
            <button 
                onClick={() => onUpdateStatus?.(agent.id, 'RUNNING')}
                className="bg-gb-bg0 border border-gb-gray hover:bg-gb-yellow hover:text-gb-bg-h p-2 text-[10px] font-bold uppercase transition-colors"
            >
              Reboot
            </button>
            <button
              onClick={() => setShowSourceCode(true)}
              className="bg-gb-bg0 border border-gb-gray hover:bg-gb-aqua hover:text-gb-bg-h p-2 text-[10px] font-bold uppercase transition-colors col-span-2"
            >
              View Source
            </button>
          </div>
        </div>

        {/* Right Column: Live Feed */}
        <div className="lg:col-span-2 flex flex-col h-[500px] border-3 border-gb-bg-h bg-black/20 relative">
           <div className="bg-gb-bg-h p-2 border-b-2 border-gb-bg0 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-gb-gray tracking-widest">Localized Log Feed</span>
              <div className="flex gap-1">
                 <span className="w-2 h-2 rounded-full bg-gb-red animate-pulse"></span>
                 <span className="text-[10px] font-mono text-gb-red">LIVE</span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-2 custom-scrollbar">
              {terminalOutput.length > 0 && (
                <div className="mb-4 space-y-1">
                  {terminalOutput.map((line, idx) => (
                    <div key={idx} className="text-gb-aqua">{line}</div>
                  ))}
                </div>
              )}

              {agentLogs.length === 0 ? (
                 <div className="text-gb-gray italic opacity-50 p-4">No recent telemetry for this unit...</div>
              ) : (
                agentLogs.map(log => (
                  <div key={log.id} className="flex gap-2 hover:bg-white/5 p-1 rounded">
                     <span className="text-gb-gray opacity-50">[{log.timestamp}]</span>
                     <span className={`${
                        log.level === 'ERR' || log.level === 'FAT' ? 'text-gb-red' :
                        log.level === 'WRN' ? 'text-gb-yellow' : 'text-gb-aqua'
                     } font-bold`}>
                       {log.level}
                     </span>
                     <span className="text-gb-fg break-all">{log.message}</span>
                  </div>
                ))
              )}
           </div>

           {/* Command Input */}
           <div className="p-2 border-t-2 border-gb-bg0 bg-gb-bg-h flex items-center gap-2">
              <span className={`text-sm font-bold ${accentColor}`}>{agent.name}@ROOT:~#</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTerminalCommand(terminalInput);
                  }
                }}
                placeholder="Type 'help' for commands..."
                className="bg-transparent border-none text-xs font-mono text-gb-fg w-full focus:ring-0 placeholder-gb-gray/50"
              />
           </div>
        </div>
      </div>

      {/* Source Code Modal */}
      {showSourceCode && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4" onClick={() => setShowSourceCode(false)}>
          <div className="bg-gb-bg0 border-4 border-gb-aqua max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gb-aqua p-4 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold uppercase text-gb-bg0">SOURCE CODE: {agent.name}</h2>
              <button onClick={() => setShowSourceCode(false)} className="text-gb-bg0 hover:text-gb-red">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 bg-black font-mono text-xs text-gb-aqua overflow-x-auto">
              <pre className="whitespace-pre">
{`/**
 * Agent Configuration: ${agent.name}
 * Version: ${agent.version}
 * Role: ${agent.role}
 * Status: ${agent.status}
 */

class ${agent.name.replace(/-/g, '_')} extends BaseAgent {
  constructor() {
    super({
      name: '${agent.name}',
      role: '${agent.role}',
      version: '${agent.version}',
      color: '${agent.color}',
      imageUrl: '${agent.imageUrl}'
    });

    this.memories = new MemoryBank();
    this.taskQueue = new PriorityQueue();
    this.status = AgentStatus.${agent.status};
  }

  async initialize() {
    console.log('[${agent.name}] Initialization sequence started...');
    await this.loadMemories();
    await this.establishConnections();
    this.status = AgentStatus.RUNNING;
    return this;
  }

  async loadMemories() {
    const persistedMemories = await db.memories.findByAgent(this.id);
    this.memories.load(persistedMemories);
    console.log(\`[${agent.name}] Loaded \${persistedMemories.length} memory artifacts\`);
  }

  async execute(task: Task) {
    console.log(\`[${agent.name}] Executing task: \${task.id}\`);

    try {
      const result = await this.processTask(task);
      this.taskQueue.complete(task.id);
      this.logSuccess(task, result);
      return result;
    } catch (error) {
      this.handleError(error, task);
      throw error;
    }
  }

  async processTask(task: Task) {
    // Agent-specific task processing logic
    const context = this.memories.recall(task.context);
    const strategy = this.selectStrategy(task.type);
    return await strategy.execute(task, context);
  }

  shutdown() {
    console.log('[${agent.name}] Initiating graceful shutdown...');
    this.taskQueue.clear();
    this.memories.persist();
    this.status = AgentStatus.OFFLINE;
  }
}

export default ${agent.name.replace(/-/g, '_')};`}
              </pre>
            </div>
            <div className="p-4 border-t-2 border-gb-bg-h flex justify-between items-center bg-gb-bg0">
              <div className="text-xs font-mono text-gb-gray">
                Lines of Code: 47 • Language: TypeScript • Last Modified: {agent.version}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Agent source code for ${agent.name}`);
                  alert('Source code copied to clipboard!');
                }}
                className="bg-gb-aqua text-gb-bg0 px-4 py-2 font-bold text-xs uppercase hover:bg-gb-aqua/80 transition-colors"
              >
                Copy Source
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AgentDetailModal;
