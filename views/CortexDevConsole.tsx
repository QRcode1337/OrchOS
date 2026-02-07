import React from 'react';
import { LogEntry, Agent } from '../types';
import ConsoleLogs from '../components/cortex/ConsoleLogs';
import ChatLobby from '../components/cortex/ChatLobby';
import StatsSidebar from '../components/cortex/StatsSidebar';

interface CortexDevConsoleProps {
    logs: LogEntry[];
    agents: Agent[];
    onBack: () => void;
    onSendMessage: (agentId: string, msg: string) => void;
}

const CortexDevConsole: React.FC<CortexDevConsoleProps> = ({ logs, agents, onBack, onSendMessage }) => {
    return (
        <div className="flex h-screen bg-gb-bg0 text-gb-fg font-mono overflow-hidden">
             {/* Main Content Area */}
             <div className="flex-1 flex flex-col min-w-0">
                 {/* Top Header */}
                 <header className="h-12 bg-gb-bg1 border-b border-gb-bg2 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-gb-red p-1.5 rounded-sm">
                            <span className="material-symbols-outlined text-gb-bg0 text-lg">terminal</span>
                        </div>
                        <h1 className="font-display font-bold text-lg uppercase tracking-widest text-gb-fg">
                            NEURAL_OS_V0.92 <span className="text-gb-gray mx-2">|</span> <span className="text-xs font-mono text-gb-green">SYSTEM ONLINE</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-bold text-gb-gray">
                        <span className="hidden md:inline">CPU: 44%</span>
                        <span className="hidden md:inline">MEM: 12.4GB</span>
                         <div className="flex items-center gap-2 border border-gb-gray/30 bg-gb-gray/10 px-3 py-1 rounded-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-gb-green animate-pulse" />
                            <span className="tracking-wider">RUNTIME: 442:12:09</span>
                         </div>
                        <span className="material-symbols-outlined cursor-pointer hover:text-gb-fg" onClick={onBack}>close</span>
                    </div>
                 </header>

                 {/* Split View */}
                 <div className="flex-1 flex flex-col min-h-0">
                     {/* Top: Logs (65%) */}
                     <div className="h-[65%] min-h-[200px] border-b border-gb-bg2">
                         <ConsoleLogs logs={logs} />
                     </div>
                     
                     {/* Bottom: Chat (35%) */}
                     <div className="flex-1 min-h-0">
                         <ChatLobby agents={agents} onSendMessage={onSendMessage} />
                     </div>
                 </div>
             </div>

             {/* Right Sidebar - hidden on small screens */}
             <div className="hidden lg:block w-80 shrink-0">
                 <StatsSidebar />
             </div>
        </div>
    );
};

export default CortexDevConsole;
