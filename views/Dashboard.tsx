import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import RightSidebar from '../components/dashboard/RightSidebar';
import StatCard from '../components/dashboard/StatCard';
import ThroughputChart from '../components/dashboard/ThroughputChart';
import AgentCard from '../components/dashboard/AgentCard';
import CreateAgentModal from '../components/dashboard/CreateAgentModal';
import AgentDetailModal from '../components/dashboard/AgentDetailModal';
import { PROFILE_IMAGE } from '../constants';
import { ViewMode, LogEntry, Agent } from '../types';

interface DashboardProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  logs: LogEntry[];
  agents: Agent[];
  onAddAgent: (agent: Agent) => void;
  onUpdateAgentStatus: (id: string, status: Agent['status']) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentView, onViewChange, logs, agents, onAddAgent, onUpdateAgentStatus }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gb-bg-h text-gb-fg font-mono">
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-20" 
        style={{
            backgroundImage: `
                linear-gradient(rgba(40, 40, 40, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(40, 40, 40, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
        }}
      ></div>

      <Sidebar 
        currentView={currentView} 
        onViewChange={onViewChange} 
        onDeploy={() => setIsCreateModalOpen(true)}
      />
      
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10 custom-scrollbar">
        <div className="scanline"></div>
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b-4 border-gb-bg0 pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-gb-fg mb-1">AGENT_DIAGNOSTIC_V2</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gb-green animate-pulse"></span>
              <p className="text-gb-gray font-bold uppercase text-[10px] tracking-[0.2em]">Amsterdam DC // Node_042 // Link: Established</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input 
                className="w-full bg-gb-bg-h border-3 border-gb-bg0 p-3 text-xs font-mono text-gb-fg focus:border-gb-blue focus:ring-0 placeholder-gb-gray outline-none transition-colors" 
                placeholder="QUERY_AGENT_REGISTRY..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-gb-blue text-sm">search</span>
            </div>
            
            <div className="hidden md:flex flex-col gap-1 w-32">
                <div className="flex justify-between text-[8px] font-bold text-gb-gray uppercase">
                    <span>System_Load</span>
                    <span className="text-gb-yellow">84%</span>
                </div>
                <div className="flex gap-0.5 h-2">
                    <div className="flex-1 bg-gb-yellow"></div>
                    <div className="flex-1 bg-gb-yellow"></div>
                    <div className="flex-1 bg-gb-yellow"></div>
                    <div className="flex-1 bg-gb-bg0"></div>
                </div>
            </div>

            <div 
              onClick={() => alert('No new notifications.')}
              className="w-12 h-12 bg-gb-bg0 border-2 border-gb-gray/20 flex items-center justify-center text-gb-yellow cursor-pointer hover:bg-gb-bg-h transition-colors"
            >
              <span className="material-symbols-outlined">notifications_active</span>
            </div>
            <div className="w-12 h-12 border-3 border-gb-bg0 bg-gb-bg0 pixel-art overflow-hidden">
              <img className="w-full h-full object-cover grayscale contrast-150 hover:grayscale-0 transition-all duration-500" src={PROFILE_IMAGE} alt="Profile" />
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Tokens (24h)" 
            icon="memory" 
            value="1,240,492" 
            progress={75} 
            color="blue" 
            subValue="+12.4% EFFICIENCY INCREASE"
            subValueColor="text-gb-green"
          />
          <StatCard 
            title="Active Tasks" 
            icon="rebase_edit" 
            value={`${agents.filter(a => a.status === 'RUNNING').length}/${agents.length}`} 
            progress={66} 
            color="yellow" 
            subValue="PROCESSING QUEUE: OPTIMAL"
            subValueColor="text-gb-aqua"
          />
          <StatCard 
            title="Compute Cost" 
            icon="attach_money" 
            value="$142.50" 
            progress={80} 
            color="red" 
            subValue="WARNING: BUDGET CAP AT 80%"
            subValueColor="text-gb-red animate-pulse"
          />
        </section>

        <section className="mb-10">
           <ThroughputChart />
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-2xl font-display font-bold uppercase tracking-tighter text-gb-fg">ACTIVE AGENTS</h3>
            <div className="h-2 flex-1 bg-gb-bg0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gb-aqua to-transparent w-1/3"></div>
            </div>
            <button 
              onClick={() => alert('Global Map View requires WebGL2 capable viewport.')}
              className="text-[10px] font-bold uppercase border-2 border-gb-gray px-4 py-2 hover:bg-gb-fg hover:text-gb-bg-h transition-colors"
            >
              Global View
            </button>
          </div>
          {filteredAgents.length === 0 ? (
            <div className="p-8 text-center border-2 border-gb-bg0 border-dashed text-gb-gray font-mono">
               NO UNITS FOUND MATCHING QUERY "{searchQuery}"
            </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                {filteredAgents.map(agent => (
                    <AgentCard 
                        key={agent.id} 
                        agent={agent} 
                        onClick={() => setSelectedAgent(agent)}
                        onUpdateStatus={onUpdateAgentStatus}
                    />
                ))}
             </div>
          )}
        </section>
      </main>

      <RightSidebar logs={logs} />

      {/* Modals */}
      <CreateAgentModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={onAddAgent}
      />
      <AgentDetailModal 
        isOpen={!!selectedAgent}
        onClose={() => setSelectedAgent(null)}
        agent={selectedAgent}
        logs={logs}
        onUpdateStatus={onUpdateAgentStatus}
      />
    </div>
  );
};

export default Dashboard;
