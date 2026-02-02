# Orchestra OS Architecture Guide

## Overview

Orchestra OS is a full-stack AI agent management dashboard built with React 19, TypeScript, Vite 6, Express 5, and Prisma 7. It provides a visual interface for deploying, monitoring, and controlling autonomous AI agents.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Vite + React)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  LandingPage │  │   Dashboard  │  │         CLI          │  │
│  │              │  │              │  │                      │  │
│  │ - Dark/Light │  │ - AgentCards │  │ - LogStream          │  │
│  │ - Theme      │  │ - StatCards  │  │ - Command Interface  │  │
│  │ - CTA        │  │ - Sidebar    │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                              │                                  │
│                    ┌─────────┴─────────┐                       │
│                    │      App.tsx      │                       │
│                    │ (State + Routing) │                       │
│                    └─────────┬─────────┘                       │
└──────────────────────────────┼──────────────────────────────────┘
                               │ fetch /api/*
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      SERVER (Express 5)                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    REST API Endpoints                       │ │
│  │  GET  /api/agents          - List all agents                │ │
│  │  POST /api/agents          - Create new agent               │ │
│  │  PUT  /api/agents/:id/status - Update agent status          │ │
│  │  GET  /api/logs            - Fetch recent logs              │ │
│  │  POST /api/logs            - Create log entry               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                    ┌─────────┴─────────┐                        │
│                    │   Prisma Client   │                        │
│                    └─────────┬─────────┘                        │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      DATABASE (SQLite)                           │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │       Agent         │  │           LogEntry              │   │
│  │  - id (uuid)        │  │  - id (uuid)                    │   │
│  │  - name             │  │  - level (INF|WRN|ERR|FAT|SYS)  │   │
│  │  - role             │  │  - source                       │   │
│  │  - status           │  │  - message                      │   │
│  │  - version          │  │  - createdAt                    │   │
│  │  - message          │  │                                 │   │
│  │  - imageUrl         │  │                                 │   │
│  │  - color            │  │                                 │   │
│  │  - progress         │  │                                 │   │
│  └─────────────────────┘  └─────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
orchestra-os/
├── App.tsx                 # Main app with state management and routing
├── index.tsx               # React entry point
├── types.ts                # TypeScript interfaces
├── constants.ts            # Initial data and templates
├── vite.config.ts          # Vite build configuration
├── prisma.config.ts        # Prisma configuration
│
├── views/
│   ├── LandingPage.tsx     # Marketing page (dark/light themes)
│   ├── Dashboard.tsx       # Main agent management view
│   ├── CLI.tsx             # Terminal-style interface
│   └── Docs.tsx            # Documentation view
│
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── RightSidebar.tsx    # Log stream panel
│   │   ├── AgentCard.tsx       # Agent display card
│   │   ├── StatCard.tsx        # Metric display card
│   │   ├── ThroughputChart.tsx # Performance chart
│   │   ├── CreateAgentModal.tsx # Agent creation form
│   │   └── AgentDetailModal.tsx # Agent detail view
│   ├── cli/
│   │   └── LogStream.tsx       # Real-time log display
│   └── shared/
│       └── Modal.tsx           # Reusable modal component
│
├── server/
│   └── index.ts            # Express API server
│
└── prisma/
    └── schema.prisma       # Database schema
```

## Performance Optimizations

### Code Splitting

The app uses React.lazy() for route-based code splitting:

```typescript
const Dashboard = lazy(() => import('./views/Dashboard'));
const CLI = lazy(() => import('./views/CLI'));
const Docs = lazy(() => import('./views/Docs'));
```

**Benefits:**
- Initial bundle reduced from 556 KB to 214 KB (62% reduction)
- Users only download view code when needed
- Faster initial page load

### Vendor Chunking

Vite is configured to separate vendor libraries:

```typescript
// vite.config.ts
manualChunks: {
  'vendor-react': ['react', 'react-dom'],
  'vendor-charts': ['recharts'],
}
```

**Chunk Sizes:**
| Chunk | Uncompressed | Gzipped |
|-------|-------------|---------|
| vendor-react | 0 KB (deduped) | - |
| vendor-charts | 303 KB | 93 KB |
| Dashboard | 28 KB | 8 KB |
| CLI | 9 KB | 3 KB |
| Docs | 3 KB | 1 KB |

### Component Memoization

All dashboard components use React.memo() to prevent unnecessary re-renders:

```typescript
export default React.memo(AgentCard);
export default React.memo(StatCard);
export default React.memo(Sidebar);
```

### Handler Stability

App.tsx uses useCallback() for all handler functions:

```typescript
const addLog = useCallback((level, source, message) => {
  // ...
}, []);

const handleAddAgent = useCallback(async (agent) => {
  // Optimistic update + API call
}, [addLog]);

const updateAgentStatus = useCallback(async (id, status) => {
  // Optimistic update + API call
}, [addLog]);
```

### Conditional Intervals

The log simulation interval only runs when relevant views are active:

```typescript
useEffect(() => {
  if (currentView !== 'dashboard' && currentView !== 'cli') {
    return; // Skip interval setup entirely
  }
  const interval = setInterval(() => { /* ... */ }, 3000);
  return () => clearInterval(interval);
}, [currentView]);
```

## Data Flow

### State Management

The app uses React's built-in state management:

```
App.tsx (Root State)
├── agents: Agent[]
├── logs: LogEntry[]
└── currentView: ViewMode

    │
    ├── fetchData() on mount → GET /api/agents, /api/logs
    ├── addLog() → Optimistic update + POST /api/logs
    ├── handleAddAgent() → Optimistic update + POST /api/agents
    └── updateAgentStatus() → Optimistic update + PUT /api/agents/:id/status
```

### Optimistic Updates

All mutations follow the optimistic update pattern:

1. Update local state immediately (instant UI feedback)
2. Send API request in background
3. On error, log to console (could rollback if needed)

### View Routing

```
ViewMode = 'landing' | 'dashboard' | 'cli' | 'docs'

landing  → LandingPage (no Suspense)
dashboard → Dashboard (lazy loaded)
cli      → CLI (lazy loaded)
docs     → Docs (lazy loaded)
```

## API Design

### RESTful Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/agents | List all agents |
| POST | /api/agents | Create agent |
| PUT | /api/agents/:id/status | Update status |
| GET | /api/logs | Get recent logs (100 max) |
| POST | /api/logs | Create log entry |

### API Proxy

Vite proxies `/api/*` requests to the Express server:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  }
}
```

## Type System

### Core Types

```typescript
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

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INF' | 'WRN' | 'ERR' | 'FAT' | 'SYS' | 'USR';
  source: string;
  message: string;
}

type ViewMode = 'landing' | 'dashboard' | 'cli' | 'docs';
type AgentColor = 'blue' | 'yellow' | 'red' | 'green' | 'purple' | 'aqua' | 'orange';
```

## Styling

### Gruvbox Theme

The app uses a custom Gruvbox-inspired color palette:

```
gb-bg0     #282828  - Primary background
gb-bg-h    #1d2021  - Darker background
gb-fg      #ebdbb2  - Primary text
gb-gray    #928374  - Secondary text
gb-red     #cc241d  - Error/Critical
gb-green   #98971a  - Success
gb-yellow  #d79921  - Warning
gb-blue    #458588  - Info
gb-aqua    #689d6a  - Accent
gb-purple  #b16286  - Accent
gb-orange  #d65d0e  - Accent
```

### Tailwind Classes

Custom utility classes defined in tailwind.config:
- `font-display` - Space Grotesk for headings
- `font-mono` - JetBrains Mono for code
- `pixel-art` - Pixelated image rendering
- `scanline` - CRT monitor effect
- `hard-shadow` - Retro drop shadow

## Development

### Start Development

```bash
pnpm dev  # Starts Vite + Express concurrently
```

### Build Production

```bash
pnpm build    # Build frontend
pnpm preview  # Preview production build
```

### Database

```bash
npx prisma migrate dev  # Run migrations
npx prisma studio       # Open database GUI
```
