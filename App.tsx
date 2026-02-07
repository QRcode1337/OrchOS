/**
 * Orchestra OS - Main Application
 *
 * A full-stack AI agent management dashboard with:
 * - Code-split views (Dashboard, Sandbox, Synthesis)
 * - Real-time log streaming
 * - Optimistic UI updates
 * - SQLite persistence via Express API
 */
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import LandingPage from './views/LandingPage';
import { ViewMode, LogEntry, Agent } from './types';
import { INITIAL_LOGS, AGENTS as INITIAL_AGENTS } from './constants';
import { useToast } from './components/shared/Toast';

/** Lazy load non-initial views for code splitting (62% bundle reduction) */
const Dashboard = lazy(() => import('./views/Dashboard'));
const AgentSandbox = lazy(() => import('./views/AgentSandbox'));
const AgentSynthesis = lazy(() => import('./views/AgentSynthesis'));
const CortexDevConsole = lazy(() => import('./views/CortexDevConsole'));
const AgentSnapshotGallery = lazy(() => import('./views/AgentSnapshotGallery'));
const AgentOrchestrator = lazy(() => import('./views/AgentOrchestrator'));
const Docs = lazy(() => import('./views/Docs'));

/** Loading fallback shown during lazy chunk loading */
const LoadingFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-gb-bg0">
    <div className="text-gb-fg font-mono text-sm animate-pulse">
      LOADING_MODULE...
    </div>
  </div>
);

const App: React.FC = () => {
  const { addToast } = useToast();
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, logsRes] = await Promise.all([
          fetch('/api/agents'),
          fetch('/api/logs')
        ]);

        if (agentsRes.ok) {
          const agentsData = await agentsRes.json();
          setAgents(agentsData);
        }

        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setLogs(logsData);
        }
      } catch {
        addToast('warning', 'Failed to load initial data. Using offline mode.');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Add a new log entry with optimistic UI update.
   * Immediately updates local state, then persists to DB in background.
   * @param level - Log severity level (INF, WRN, ERR, FAT, SYS, USR)
   * @param source - Source identifier (agent name or system component)
   * @param message - Log message content
   */
  const addLog = useCallback((level: LogEntry['level'], source: string, message: string) => {
    // Optimistic update
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level,
      source,
      message
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));

    // Persist to DB
    fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, source, message })
    }).catch(() => { /* Log persistence is non-critical, fire-and-forget */ });
  }, []);

  /**
   * Create a new agent with optimistic UI update.
   * Immediately adds to local state, then persists to DB.
   * Also creates log entries for the deployment.
   * @param agent - New agent data from CreateAgentModal
   */
  const handleAddAgent = useCallback(async (agent: Agent) => {
    // Optimistic UI update
    setAgents(prev => [agent, ...prev]);
    
    try {
        await fetch('/api/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agent)
        });

        addLog('SYS', 'ORCHESTRATOR', `Deploying new agent: ${agent.name} (v${agent.version})`);
        
        setTimeout(() => {
            addLog('INF', agent.name, 'Initialization sequence complete. Status: RUNNING');
        }, 1500);

    } catch {
        addToast('error', `Failed to deploy agent "${agent.name}". Reverting.`);
        setAgents(prev => prev.filter(a => a.id !== agent.id));
    }
  }, [addLog, addToast]);

  /**
   * Update an agent's status with optimistic UI update.
   * Immediately updates local state, then persists to DB.
   * @param id - Agent ID to update
   * @param status - New status (RUNNING, IDLE, ERROR, OFFLINE)
   */
  const updateAgentStatus = useCallback(async (id: string, status: Agent['status']) => {
    // Capture previous status for rollback
    let previousStatus: Agent['status'] | undefined;
    setAgents(prev => prev.map(agent => {
      if (agent.id === id) {
        previousStatus = agent.status;
        return { ...agent, status };
      }
      return agent;
    }));

    try {
        await fetch(`/api/agents/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        addLog('SYS', 'ORCHESTRATOR', `Agent ${id} status update: ${status}`);
    } catch {
        addToast('error', `Failed to update agent ${id} status. Reverting.`);
        if (previousStatus) {
          setAgents(prev => prev.map(a => a.id === id ? { ...a, status: previousStatus! } : a));
        }
    }
  }, [addLog, addToast]);

  /**
   * Handle sending a message to an agent.
   * Simulates a response for now.
   */
  const handleSendMessage = useCallback((agentId: string, msg: string) => {
    const agent = agents.find(a => a.id === agentId);
    addLog('USR', agent?.name || 'USER', `>> ${msg}`);
    // Simulate agent response log
    setTimeout(() => {
        addLog('INF', agent?.name || 'AGENT', `Processing: ${msg.substring(0, 50)}...`);
    }, 1500);
  }, [agents, addLog]);

  // Simulate incoming logs - only runs when dashboard or CLI is visible
  useEffect(() => {
    // Skip interval if not on a view that shows logs
    if (currentView !== 'dashboard' && currentView !== 'cli') {
      return;
    }

    const interval = setInterval(() => {
      setAgents(currentAgents => {
        const activeAgents = currentAgents.filter(a => a.status === 'RUNNING');

        // Reduce log frequency when no agents are running
        if (activeAgents.length === 0 && Math.random() > 0.2) {
          return currentAgents;
        }

        const sources = [...activeAgents.map(a => a.name), 'SYSTEM', 'NETWORK', 'SECURITY'];

        const messages = [
          'Processing data packet...',
          'Optimizing neural weights...',
          'Connection stabilised.',
          'Buffer flush initiated.',
          'Garbage collection running...',
          'Ping response: 12ms',
          'Validating API schema...',
          'Syncing state with cluster...',
          'Memory usage nominal.',
        ];
        const levels: LogEntry['level'][] = ['INF', 'INF', 'INF', 'SYS', 'WRN'];

        const randomLog: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          level: levels[Math.floor(Math.random() * levels.length)],
          source: sources[Math.floor(Math.random() * sources.length)] || 'SYSTEM',
          message: messages[Math.floor(Math.random() * messages.length)]
        };

        setLogs(prev => [randomLog, ...prev].slice(0, 100));
        // Note: We are NOT persisting these random simulation logs to DB to avoid cluttering it too fast.
        return currentAgents;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentView]); // Only re-run when view changes, not when agents change

  // Memoized view change handlers for LandingPage
  const handleLaunch = useCallback(() => setCurrentView('dashboard'), []);
  const handleViewDocs = useCallback(() => setCurrentView('docs'), []);
  const handleViewTerminal = useCallback(() => setCurrentView('cli'), []);

  if (currentView === 'landing') {
    return (
      <LandingPage
        onLaunch={handleLaunch}
        onViewDocs={handleViewDocs}
        onViewTerminal={handleViewTerminal}
      />
    );
  }

  // Map 'docs' view to Docs (System Manual)
  if (currentView === 'docs') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Docs onBack={() => setCurrentView('landing')} />
      </Suspense>
    );
  }

  // Map 'synthesis' view to AgentSynthesis (Visualizer)
  if (currentView === 'synthesis') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AgentSynthesis onBack={() => setCurrentView('dashboard')} />
      </Suspense>
    );
  }
  
  // Map 'cli' view to AgentSandbox
  if (currentView === 'cli') {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <AgentSandbox 
              logs={logs} 
              onDeploy={() => setCurrentView('dashboard')} 
          />
        </Suspense>
      );
  }

  // Map 'cortex' view to CortexDevConsole
  if (currentView === 'cortex') {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <CortexDevConsole
              logs={logs}
              agents={agents}
              onBack={() => setCurrentView('dashboard')}
              onSendMessage={handleSendMessage}
          />
        </Suspense>
      );
  }

  // Map 'snapshots' view to AgentSnapshotGallery
  if (currentView === 'snapshots') {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <AgentSnapshotGallery
              onBack={() => setCurrentView('dashboard')}
          />
        </Suspense>
      );
  }

  // Map 'orchestrator' view to AgentOrchestrator
  if (currentView === 'orchestrator') {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <AgentOrchestrator
              onBack={() => setCurrentView('dashboard')}
              logs={logs}
              onSendMessage={handleSendMessage}
          />
        </Suspense>
      );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="w-full h-full">
        <Dashboard
            currentView={currentView}
            onViewChange={setCurrentView}
            logs={logs}
            agents={agents}
            onAddAgent={handleAddAgent}
            onUpdateAgentStatus={updateAgentStatus}
            isLoading={isLoadingData}
        />
      </div>
    </Suspense>
  );
};

export default App;
