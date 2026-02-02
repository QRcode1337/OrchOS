# Orchestra OS API Documentation

## Type Definitions

### Core Types

```typescript
// types.ts

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INF' | 'WRN' | 'ERR' | 'FAT' | 'SYS' | 'USR';
  source: string;
  message: string;
}

type AgentColor = 'blue' | 'yellow' | 'red' | 'green' | 'purple' | 'aqua' | 'orange';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'RUNNING' | 'IDLE' | 'ERROR' | 'OFFLINE';
  version: string;
  message: string;
  imageUrl: string;
  color: AgentColor;
  progress?: number;
}

type ViewMode = 'landing' | 'dashboard' | 'cli' | 'docs';
```

---

## Component Reference

### Views

#### Dashboard

Main agent management interface with search, stats, and agent grid.

```typescript
interface DashboardProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  logs: LogEntry[];
  agents: Agent[];
  onAddAgent: (agent: Agent) => void;
  onUpdateAgentStatus: (id: string, status: Agent['status']) => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `currentView` | `ViewMode` | Current active view for sidebar highlighting |
| `onViewChange` | `(view: ViewMode) => void` | Callback to change the active view |
| `logs` | `LogEntry[]` | Array of log entries to display in RightSidebar |
| `agents` | `Agent[]` | Array of agents to display in the grid |
| `onAddAgent` | `(agent: Agent) => void` | Callback when a new agent is created |
| `onUpdateAgentStatus` | `(id: string, status: Agent['status']) => void` | Callback to update agent status |

---

#### LandingPage

Marketing page with dual theme support (dark/light).

```typescript
interface LandingPageProps {
  onLaunch: () => void;
  onViewDocs: () => void;
  onViewTerminal?: () => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `onLaunch` | `() => void` | Navigate to dashboard |
| `onViewDocs` | `() => void` | Navigate to documentation |
| `onViewTerminal` | `() => void` | Optional: Navigate to CLI |

---

### Dashboard Components

#### AgentCard

Displays an individual agent with status, progress, and controls.

```typescript
interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
  onUpdateStatus?: (id: string, status: Agent['status']) => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `agent` | `Agent` | Agent data to display |
| `onClick` | `() => void` | Callback when card is clicked (opens detail modal) |
| `onUpdateStatus` | `(id, status) => void` | Callback for play/pause/terminate buttons |

**Features:**
- Color-coded header based on agent color
- Status indicator animations (pulse for RUNNING, ping for ERROR)
- Progress bar
- Control buttons (play, pause, terminate)

---

#### StatCard

Displays a metric with progress bar and status text.

```typescript
interface StatCardProps {
  title: string;
  icon: string;
  value: string;
  subValue: string;
  subValueColor: string;
  color: 'blue' | 'yellow' | 'red';
  progress: number;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Card title (e.g., "Total Tokens") |
| `icon` | `string` | Material Symbols icon name |
| `value` | `string` | Main value to display |
| `subValue` | `string` | Secondary text below value |
| `subValueColor` | `string` | Tailwind class for subValue color |
| `color` | `'blue' \| 'yellow' \| 'red'` | Theme color for border and progress |
| `progress` | `number` | Progress bar percentage (0-100) |

**Example:**
```tsx
<StatCard
  title="Active Tasks"
  icon="rebase_edit"
  value="2/3"
  progress={66}
  color="yellow"
  subValue="PROCESSING QUEUE: OPTIMAL"
  subValueColor="text-gb-aqua"
/>
```

---

#### Sidebar

Navigation sidebar with agent-themed navigation items.

```typescript
interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onDeploy?: () => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `currentView` | `ViewMode` | Currently active view for highlighting |
| `onViewChange` | `(view: ViewMode) => void` | Callback to change view |
| `onDeploy` | `() => void` | Callback for deploy button click |

---

#### RightSidebar

Log stream panel showing real-time system logs.

```typescript
interface RightSidebarProps {
  logs: LogEntry[];
}
```

| Prop | Type | Description |
|------|------|-------------|
| `logs` | `LogEntry[]` | Array of logs to display |

**Log Level Colors:**
- `ERR`/`FAT` - Red
- `WRN` - Yellow
- `SYS` - Aqua
- `INF` - Blue

---

#### CreateAgentModal

Form modal for creating new agents with template support.

```typescript
interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agent: Agent) => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Callback to close modal |
| `onCreate` | `(agent: Agent) => void` | Callback with new agent data |

**Features:**
- Quick-load templates (SEC-OP-9, CODE-WEAVER, DATA-MINER)
- Color picker
- Live preview using AgentCard
- Form validation

---

#### AgentDetailModal

Detailed view of a single agent with logs and controls.

```typescript
interface AgentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  logs: LogEntry[];
  onUpdateStatus: (id: string, status: Agent['status']) => void;
}
```

---

### Shared Components

#### Modal

Reusable modal wrapper with animation support.

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls visibility with fade animation |
| `onClose` | `() => void` | Close callback (also triggered by backdrop click) |
| `title` | `string` | Modal title in header |
| `children` | `React.ReactNode` | Modal content |

**Features:**
- Backdrop blur effect
- Scale/fade animations
- Body scroll lock when open
- Close button in header

---

## REST API Endpoints

Base URL: `http://localhost:3001` (proxied as `/api` in development)

### Agents

#### List Agents

```
GET /api/agents
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "NEXUS-07",
    "role": "DATA_PROCESSOR",
    "status": "RUNNING",
    "version": "v2.1.0_STABLE",
    "message": "Processing...",
    "imageUrl": "https://...",
    "color": "blue",
    "progress": 85,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### Create Agent

```
POST /api/agents
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "NEW_AGENT_01",
  "role": "GENERAL_PURPOSE",
  "status": "IDLE",
  "version": "v1.0.0",
  "message": "Initializing...",
  "imageUrl": "https://...",
  "color": "green",
  "progress": 0
}
```

**Response:** Created agent object

---

#### Update Agent Status

```
PUT /api/agents/:id/status
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "RUNNING"
}
```

**Response:** Updated agent object

**Side Effect:** Creates a log entry documenting the status change.

---

### Logs

#### List Logs

```
GET /api/logs
```

Returns the 100 most recent logs, ordered by `createdAt` descending.

**Response:**
```json
[
  {
    "id": "uuid",
    "level": "INF",
    "source": "NEXUS-07",
    "message": "Processing complete",
    "timestamp": "14:22:01",
    "createdAt": "2024-01-01T14:22:01.000Z"
  }
]
```

---

#### Create Log

```
POST /api/logs
Content-Type: application/json
```

**Request Body:**
```json
{
  "level": "SYS",
  "source": "ORCHESTRATOR",
  "message": "New agent deployed"
}
```

**Response:** Created log entry

---

## Database Schema (Prisma)

```prisma
model Agent {
  id        String   @id @default(uuid())
  name      String
  role      String
  status    String   // 'RUNNING', 'IDLE', 'ERROR', 'OFFLINE'
  version   String
  message   String
  imageUrl  String
  color     String
  progress  Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model LogEntry {
  id        String   @id @default(uuid())
  level     String   // 'INF', 'WRN', 'ERR', 'FAT', 'SYS', 'USR'
  source    String
  message   String
  createdAt DateTime @default(now())
}
```

---

## Constants

### Agent Templates

```typescript
const AGENT_TEMPLATES = [
  {
    name: 'SEC-OP-9',
    role: 'SECURITY_AUDIT',
    color: 'red',
    message: 'Monitoring network traffic for anomalies...'
  },
  {
    name: 'CODE-WEAVER',
    role: 'DEV_OPS',
    color: 'blue',
    message: 'Compiling latest build artifacts...'
  },
  {
    name: 'DATA-MINER',
    role: 'ANALYTICS',
    color: 'yellow',
    message: 'Processing localized data clusters...'
  }
];
```

### CLI Commands

```typescript
const CLI_COMMANDS = [
  { cmd: 'deploy <agent>', desc: 'Initialize new agent instance' },
  { cmd: 'sys_status', desc: 'Display core metrics' },
  { cmd: 'net_flush', desc: 'Clear local buffer cache' },
  { cmd: 'kill -9 <pid>', desc: 'Force terminate process' },
];
```
