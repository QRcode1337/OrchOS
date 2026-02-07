import React, { useState, useEffect, useRef } from 'react';
import { Agent, LogEntry } from '../types';
import NeuralMap from '../components/synthesis/NeuralMap';
import OrchestrationControls from '../components/synthesis/OrchestrationControls';
import ChatLobby from '../components/cortex/ChatLobby';
import ConsoleLogs from '../components/cortex/ConsoleLogs';

interface AgentOrchestratorProps {
    onBack: () => void;
    logs: LogEntry[];
    onSendMessage: (agentId: string, msg: string) => void;
}

type TabMode = 'LOGS' | 'FILES' | 'MAP' | 'CONSOLE';

const AgentOrchestrator: React.FC<AgentOrchestratorProps> = ({ onBack, logs, onSendMessage }) => {
    // State
    const [activeTab, setActiveTab] = useState<TabMode>('CONSOLE');
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
    const [consoleEvents, setConsoleEvents] = useState<any[]>([]); // Rich events for the console
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        // Fetch Agents and Console Events
        Promise.all([
            fetch('/api/agents').then(res => res.json()),
            fetch('/api/console').then(res => res.json())
        ]).then(([agentsData, consoleData]) => {
            setAgents(agentsData);
            if (Array.isArray(consoleData)) {
                setConsoleEvents(consoleData);
            }
        }).catch(console.error);

        // Poll for new events every 2s
        const interval = setInterval(() => {
             fetch('/api/console').then(res => res.json()).then(data => {
                 if (Array.isArray(data)) setConsoleEvents(data);
             }).catch(console.error);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
        
        try {
            // Optimistic update
            const tempId = Date.now();
            const optimisticEvent = {
                id: tempId,
                type: 'CMD',
                agent: 'SysAdmin',
                time: new Date().toLocaleTimeString('en-US', {hour12: false}),
                content: `> ${inputText}`
            };
            setConsoleEvents(prev => [...prev, optimisticEvent]);
            
            await fetch('/api/console', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'CMD',
                    agent: 'SysAdmin',
                    content: `> ${inputText}`
                })
            });

            onSendMessage('USER', inputText);
            setInputText('');
        } catch (e) {
            console.error('Failed to send command', e);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0d0d0d] text-[#a0a0a0] font-mono overflow-hidden select-none selection:bg-[#ff9900] selection:text-black">
            {/* Top Navigation Bar */}
            <header className="h-14 border-b border-[#333] flex justify-between items-center px-6 bg-[#0a0a0a]">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="text-[#ff9900] font-bold flex items-center gap-2 hover:bg-[#ff9900]/10 px-2 py-1 rounded transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="font-display tracking-widest text-lg">OPENCLAW ROOMS</span>
                    </button>
                    <div className="text-[10px] text-[#555] font-bold tracking-[0.2em] pt-1">STATUS: CONNECTED // NODE_ACTIVE</div>
                </div>

                <div className="flex gap-8">
                    {(['LOGS', 'FILES', 'MAP', 'CONSOLE'] as TabMode[]).map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-sm font-bold tracking-widest px-1 py-4 border-b-2 transition-all ${activeTab === tab ? 'text-[#ff9900] border-[#ff9900]' : 'text-[#666] border-transparent hover:text-[#bbb]'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold text-[#666]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#ff9900] rounded-full animate-pulse"></div>
                        INJECTION GUARD: ON
                    </div>
                    <div>LATENCY: 24ms</div>
                    <div className="flex gap-1">
                        <button className="p-2 border border-[#333] hover:border-[#666] transition-colors"><span className="material-symbols-outlined text-sm">notifications</span></button>
                        <button className="p-2 border border-[#333] hover:border-[#666] transition-colors"><span className="material-symbols-outlined text-sm">settings</span></button>
                        <button className="p-2 bg-[#333] text-[#ff9900]"><span className="material-symbols-outlined text-sm">person</span></button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Levels Tree (Mock Navigation) */}
                <div className="w-64 border-r border-[#333] bg-[#0a0a0a] flex flex-col pt-6">
                     <div className="px-6 mb-6 text-[#ff9900] font-bold text-xs tracking-[0.2em] uppercase">LEVELS_TREE</div>
                     <nav className="flex-1 overflow-y-auto">
                        <div className="px-4 py-2 text-xs font-bold text-[#555] hover:text-[#ccc] cursor-pointer flex items-center gap-2">
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span> LEVEL_0
                        </div>
                        <div className="px-4 py-2 text-xs font-bold text-[#555] hover:text-[#ccc] cursor-pointer flex items-center gap-2">
                             <span className="material-symbols-outlined text-[14px]">chevron_right</span> LEVEL_1
                        </div>
                         <div className="pl-8 py-2 text-xs font-bold text-[#888] hover:text-white cursor-pointer border-l border-[#333] ml-5">
                             <span className="opacity-50 mr-2">↳</span> SUBLEVEL_VAULT
                         </div>
                         <div className="pl-8 py-2 text-xs font-bold text-[#ff9900] bg-[#ff9900]/10 border-l-2 border-[#ff9900] ml-5 cursor-pointer flex justify-between items-center pr-4">
                             <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[12px]">radio_button_checked</span> HALLWAY_NODE_12</span>
                         </div>
                         <div className="px-4 py-2 text-xs font-bold text-[#555] mt-2 hover:text-[#ccc] cursor-pointer flex items-center gap-2">
                             <span className="material-symbols-outlined text-[14px]">chevron_right</span> THE_VOID
                         </div>
                     </nav>
                     {/* System Integrity (Visual) */}
                     <div className="p-6 border-t border-[#333]">
                         <div className="flex justify-between text-[10px] text-[#555] mb-2 font-bold uppercase"><span>System Integrity</span> <span>98.2%</span></div>
                         <div className="h-1 bg-[#222] w-full mb-1">
                             <div className="h-full bg-[#ff9900] w-[98%]"></div>
                         </div>
                         <div className="h-1 bg-[#222] w-full">
                            <div className="h-full bg-[#ff9900] w-[60%] opacity-50"></div>
                         </div>
                         <button className="w-full mt-6 bg-[#ff9900] text-black font-bold uppercase text-xs py-3 hover:bg-[#ffaa33] transition-colors flex items-center justify-center gap-2">
                             <span className="material-symbols-outlined text-sm">diamond</span> SPAWN ZONE
                         </button>
                     </div>
                </div>

                {/* Center Content: Console / Map */}
                <div className="flex-1 bg-[#0d0d0d] flex flex-col relative">
                    {activeTab === 'CONSOLE' && (
                        <>
                            {/* Breadcrumbs */}
                            <div className="h-10 flex items-center px-6 border-b border-[#333] text-[10px] font-bold text-[#555] uppercase tracking-wider gap-2">
                                <span className="material-symbols-outlined text-sm">folder_open</span> LEVEL_0 <span className="text-[#333]">/</span> <span className="text-[#ff9900]">HALLWAY_NODE_12</span>
                                <div className="ml-auto flex items-center gap-2 text-[#444]">
                                    <span className="material-symbols-outlined text-sm">visibility</span> 128 SENSORS ONLINE
                                </div>
                            </div>

                            {/* Console Stream */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                                <div className="text-center mb-8">
                                    <span className="border border-[#333] px-4 py-2 text-[10px] text-[#555] font-mono uppercase bg-[#111]">
                                        SESSION_INITIATED: HALLWAY_NODE_12 // LOCAL_TIME: 14:02:11
                                    </span>
                                </div>

                                {consoleEvents.map(event => (
                                    <div key={event.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        {/* Avatar & Meta */}
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-black font-bold text-xs
                                                ${event.type === 'PLAN' ? 'bg-[#7aa2f7]' : event.type === 'ACTION' ? 'bg-[#ff9900]' : 'bg-[#444]'}`}>
                                                {event.agent.charAt(0)}
                                            </div>
                                            <span className="font-bold text-[#e0e0e0] text-xs">{event.agent}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 font-bold rounded-sm uppercase 
                                                ${event.type === 'PLAN' ? 'bg-[#7aa2f7]/20 text-[#7aa2f7]' : 
                                                  event.type === 'ACTION' ? 'bg-[#ff9900]/20 text-[#ff9900]' : 
                                                  event.type === 'TRACE' ? 'bg-[#9ece6a]/20 text-[#9ece6a]' : 'bg-[#333] text-[#888]'}`}>
                                                {event.type}
                                            </span>
                                            <span className="text-[10px] text-[#555] font-mono ml-auto">{event.time}</span>
                                        </div>
                                        
                                        {/* Content Box */}
                                        <div className={`ml-11 p-4 border-l-2 font-mono text-sm leading-relaxed ${
                                            event.type === 'ACTION' ? 'border-[#ff9900] bg-[#ff9900]/5 text-[#ffcc66]' :
                                            event.type === 'PLAN' ? 'border-[#7aa2f7] bg-[#7aa2f7]/5 text-[#a3c2ff]' :
                                            'border-[#333] bg-[#111] text-[#ccc]'
                                        }`}>
                                            {event.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="h-20 border-t border-[#333] bg-[#0a0a0a] p-4 flex items-center gap-4">
                                <div className="flex gap-2">
                                    <button className="bg-[#ff9900] text-black text-[10px] font-bold px-3 py-1 uppercase rounded-sm hover:bg-[#ffaa33]">CHAT</button>
                                    <button className="border border-[#333] text-[#666] text-[10px] font-bold px-3 py-1 uppercase rounded-sm hover:border-[#666] hover:text-[#aaa]">COMMAND</button>
                                </div>
                                <div className="flex-1 bg-[#111] border border-[#333] h-10 flex items-center px-4">
                                    <span className="text-[#ff9900] mr-2 text-xs font-bold">&gt;</span>
                                    <input 
                                        className="bg-transparent border-none outline-none text-[#e0e0e0] text-xs font-mono w-full placeholder-[#444]"
                                        placeholder="TYPE_MESSAGE_OR_COMMAND_HERE..."
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                </div>
                                <button 
                                    onClick={handleSendMessage}
                                    className="bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] font-bold uppercase text-xs px-6 h-10 hover:bg-[#222] hover:border-[#555] transition-all flex items-center gap-2"
                                >
                                    RUN AS AGENT
                                    <span className="material-symbols-outlined text-sm text-[#ff9900]">bolt</span>
                                </button>
                            </div>
                        </>
                    )}

                    {activeTab === 'MAP' && (
                         <div className="absolute inset-0">
                             <NeuralMap agents={agents} memories={[]} convergence={50} />
                         </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {(activeTab === 'LOGS' || activeTab === 'FILES') && (
                        <div className="flex items-center justify-center h-full text-[#333] font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
                            MODULE_LOADING...
                        </div>
                    )}
                </div>

                {/* Right Sidebar: Active Entities */}
                <div className="w-80 border-l border-[#333] bg-[#0a0a0a] flex flex-col">
                    <div className="p-6 border-b border-[#333] flex justify-between items-center">
                         <span className="text-[#ff9900] font-bold text-xs tracking-[0.2em] uppercase">PRESENT ENTITIES</span>
                         <span className="bg-[#ff9900] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">{agents.length} ACTIVE</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {agents.map(agent => (
                            <div key={agent.id} className="border border-[#333] bg-[#111] p-3 hover:border-[#555] transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold text-black ${agent.status === 'RUNNING' ? 'bg-[#ff9900]' : 'bg-[#333] text-[#888]'}`}>
                                            {agent.role === 'DATA_PROCESSOR' ? 'db' : 'bot'}
                                        </div>
                                        <div>
                                            <div className="text-[#e0e0e0] text-xs font-bold">{agent.name}</div>
                                            <div className="text-[9px] text-[#666] font-bold uppercase">{agent.role}</div>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button className="border border-[#333] text-[9px] text-[#666] px-2 py-1 font-bold uppercase hover:bg-[#222] hover:text-[#aaa]">SHELL</button>
                                    <button className="border border-[#333] text-[9px] text-[#666] px-2 py-1 font-bold uppercase hover:bg-[#222] hover:text-[#aaa]">VISION_API</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Node Activity Monitor (Bottom Right) */}
                    <div className="h-48 border-t border-[#333] bg-[#0d0d0d] p-4 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold text-[#555] uppercase">NODE ACTIVITY MONITOR</span>
                            <span className="material-symbols-outlined text-[#333] text-xs">analytics</span>
                        </div>
                        {/* Fake Histogram */}
                        <div className="flex items-end gap-1 h-24 mb-2">
                            {[40, 60, 30, 80, 50, 20, 90, 45, 70, 30].map((h, i) => (
                                <div key={i} className="flex-1 bg-[#ff9900]" style={{ height: `${h}%`, opacity: 0.2 + (i/10) }}></div>
                            ))}
                        </div>
                        <div className="text-center text-[9px] text-[#333] font-mono pt-2 border-t border-[#222]">SPECTRAL_ANALYSIS_LIVE</div>
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <footer className="h-6 border-t border-[#333] bg-[#0a0a0a] flex items-center justify-between px-6 text-[9px] font-bold text-[#444] uppercase tracking-wider">
                <div className="flex gap-6">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[10px] text-[#ff9900]">grid_4x4</span> ZONE_CLEAR</span>
                    <span>RAM: 4.2GB / 12GB</span>
                </div>
                <div className="flex gap-6">
                    <span>OPENCLAW_CONSOLE_V.1.0.4-STABLE</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#ff9900] rounded-full"></div> SYSLOG_ONLINE</span>
                </div>
            </footer>
        </div>
    );
};

export default AgentOrchestrator;
