/**
 * Represents a single log entry in the system.
 * Logs are displayed in the RightSidebar and CLI views.
 */
export interface LogEntry {
  /** Unique identifier for the log entry */
  id: string;
  /** Human-readable timestamp (e.g., "14:22:01") */
  timestamp: string;
  /** Log severity level */
  level: 'INF' | 'WRN' | 'ERR' | 'FAT' | 'SYS' | 'USR';
  /** Source of the log (agent name or system component) */
  source: string;
  /** Log message content */
  message: string;
}

/**
 * Available color themes for agents.
 * Maps to Tailwind classes like `bg-gb-blue`, `text-gb-yellow`, etc.
 */
export type AgentColor = 'blue' | 'yellow' | 'red' | 'green' | 'purple' | 'aqua' | 'orange';

/**
 * Represents an AI agent in the system.
 * Agents are displayed in AgentCard components and managed through the Dashboard.
 */
export interface Agent {
  /** Unique identifier for the agent */
  id: string;
  /** Display name (e.g., "NEXUS-07") */
  name: string;
  /** Operational role (e.g., "DATA_PROCESSOR") */
  role: string;
  /** Current operational status */
  status: 'RUNNING' | 'IDLE' | 'ERROR' | 'OFFLINE';
  /** Version string (e.g., "v2.1.0_STABLE") */
  version: string;
  /** Current activity or status message */
  message: string;
  /** URL for agent avatar image */
  imageUrl: string;
  /** Theme color for the agent card */
  color: AgentColor;
  /** Task progress percentage (0-100) */
  progress?: number;
  /** Persistent memories/facts stored by the agent */
  memories?: MemoryEntry[];
}

/**
 * Represents a persistent memory or fact stored by an agent.
 */
export interface MemoryEntry {
  id: string;
  agentId: string;
  key: string;
  value: string;
  type: 'FACT' | 'OBSERVATION' | 'SYNTHESIS';
  createdAt: string;
}

/**
 * Application view modes for routing.
 * Controls which view component is rendered.
 */
export type ViewMode = 'landing' | 'dashboard' | 'cli' | 'docs' | 'synthesis';
