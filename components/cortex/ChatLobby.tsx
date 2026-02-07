import React, { useState, useEffect, useRef } from 'react';
import { Agent, ChatMessage, AgentColor } from '../../types';

interface ChatLobbyProps {
  agents: Agent[];
  onSendMessage: (agentId: string, msg: string) => void;
}

const ChatLobby: React.FC<ChatLobbyProps> = ({ agents, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({});
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-select first agent when agents load
  useEffect(() => {
    if (agents.length > 0 && !selectedAgentId) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents, selectedAgentId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [conversations, selectedAgentId]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const currentMessages = selectedAgentId ? conversations[selectedAgentId] || [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedAgentId) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      agentId: selectedAgentId,
      agentName: selectedAgent?.name || 'Unknown',
      sender: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      color: selectedAgent?.color
    };

    setConversations(prev => ({
      ...prev,
      [selectedAgentId]: [...(prev[selectedAgentId] || []), newMessage]
    }));

    onSendMessage(selectedAgentId, input);
    setInput('');

    // Simulate agent response after 1-2 seconds
    setTimeout(() => {
      const responses = [
        'Processing your request...',
        'Acknowledged. Executing protocol...',
        'Command received. Analyzing parameters...',
        'Confirmed. Initiating sequence...',
        'Query logged. Standby for results...',
        'Request queued. Current load: nominal.',
        'Understood. Calibrating response matrix...',
        'Directive accepted. Status: IN_PROGRESS'
      ];

      const agentResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        agentId: selectedAgentId,
        agentName: selectedAgent?.name || 'Unknown',
        sender: 'agent',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        color: selectedAgent?.color
      };

      setConversations(prev => ({
        ...prev,
        [selectedAgentId]: [...(prev[selectedAgentId] || []), agentResponse]
      }));
    }, 1000 + Math.random() * 1000);
  };

  const getColorClass = (color?: AgentColor) => {
    switch(color) {
      case 'blue': return 'gb-blue';
      case 'yellow': return 'gb-yellow';
      case 'red': return 'gb-red';
      case 'green': return 'gb-green';
      case 'purple': return 'gb-purple';
      case 'aqua': return 'gb-aqua';
      case 'orange': return 'gb-orange';
      default: return 'gb-fg';
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch(status) {
      case 'RUNNING': return 'bg-gb-green';
      case 'IDLE': return 'bg-gb-yellow';
      case 'ERROR': return 'bg-gb-red';
      case 'OFFLINE': return 'bg-gb-gray';
      default: return 'bg-gb-gray';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gb-bg1 border-t border-gb-bg2">
      {/* Header with selected agent info */}
      <div className="h-10 bg-gb-yellow text-gb-bg0 flex items-center justify-between px-4 shrink-0 font-bold font-display uppercase tracking-widest text-xs">
        <span>[ AGENT_GATEWAY ]</span>
        {selectedAgent && (
          <span className="text-[10px] opacity-90 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(selectedAgent.status)} animate-pulse`} />
            ACTIVE: {selectedAgent.name}
          </span>
        )}
      </div>

      <div className="flex h-[calc(100%-2.5rem)]">
        {/* Agent Selector Sidebar */}
        <div className="w-64 bg-gb-bg0 border-r border-gb-bg2 flex flex-col">
          <div className="h-8 bg-gb-bg1 border-b border-gb-bg2 flex items-center px-3">
            <span className="text-[10px] font-bold text-gb-gray uppercase tracking-wider">
              Select Agent ({agents.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {agents.length === 0 ? (
              <div className="p-4 text-xs text-gb-gray/50 text-center font-mono">
                No agents available.<br/>Deploy agents to begin.
              </div>
            ) : (
              agents.map(agent => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`
                    p-3 border-b border-gb-bg2 cursor-pointer transition-all
                    ${selectedAgentId === agent.id
                      ? 'bg-gb-bg2 border-l-2 border-l-gb-yellow'
                      : 'hover:bg-gb-bg1 border-l-2 border-l-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                    <span className={`text-xs font-bold text-${getColorClass(agent.color)} uppercase`}>
                      {agent.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-gb-gray font-mono">
                    {agent.role}
                  </div>
                  <div className="text-[9px] text-gb-gray/50 font-mono mt-1">
                    {agent.version} • {agent.status}
                  </div>
                  {conversations[agent.id] && conversations[agent.id].length > 0 && (
                    <div className="mt-1 text-[9px] text-gb-aqua font-mono">
                      {conversations[agent.id].length} messages
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedAgent ? (
            <>
              {/* Chat Messages */}
              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative"
              >
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#aeadaf 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                {currentMessages.length === 0 ? (
                  <div className="text-center text-gb-gray/50 text-xs font-mono pt-12">
                    <div className="mb-2">No messages with {selectedAgent.name}</div>
                    <div className="text-[10px]">Start a conversation below...</div>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 max-w-[80%] ${
                        msg.sender === 'user' ? 'items-end self-end' : 'items-start'
                      }`}
                    >
                      <div className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-2 text-${getColorClass(msg.color)}`}>
                        {msg.sender === 'agent' && (
                          <span className={`w-2 h-2 bg-${getColorClass(msg.color)} rounded-sm`} />
                        )}
                        {msg.sender === 'user' ? 'USER' : msg.agentName}
                        {msg.sender === 'user' && (
                          <span className={`w-2 h-2 bg-${getColorClass(msg.color)} rounded-sm`} />
                        )}
                      </div>
                      <div className={`bg-gb-bg0 border border-${getColorClass(msg.color)}/30 p-3 text-xs text-gb-fg font-mono shadow-md relative`}>
                        <div className={`absolute ${
                          msg.sender === 'user'
                            ? '-right-1 border-r border-t transform rotate-45'
                            : '-left-1 border-l border-t transform -rotate-45'
                        } top-3 w-2 h-2 bg-gb-bg0 border-${getColorClass(msg.color)}/30`} />
                        {msg.content}
                        <div className="text-[9px] text-gb-gray/50 mt-2">
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gb-bg2 bg-gb-bg0">
                <form onSubmit={handleSubmit} className="flex gap-0 relative group">
                  <div className="absolute inset-0 border border-gb-bg2 group-hover:border-gb-gray/50 transition-colors pointer-events-none" />
                  <div className="px-4 py-3 bg-gb-bg1 border-r border-gb-bg2 text-gb-red font-bold font-mono text-sm flex items-center">
                    &gt;
                  </div>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`MESSAGE ${selectedAgent.name}...`}
                    className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-mono text-gb-fg placeholder-gb-gray/30 focus:bg-gb-bg1/20 transition-colors"
                    spellCheck={false}
                  />
                  <button
                    type="submit"
                    className={`px-6 bg-${getColorClass(selectedAgent.color)} text-gb-bg0 font-bold text-xs uppercase hover:opacity-90 transition-opacity`}
                  >
                    SEND
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gb-gray/50 text-sm font-mono">
              Select an agent to begin communication
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLobby;
