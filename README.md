# ORCHESTRA OS // v4.2.0

<div align="center">
  <h3>The Next-Gen Agentic Command Center</h3>
  <p>Status: <strong>PROTOTYPE_PHASE</strong> | Core: <strong>REACT_19</strong> | Style: <strong>RETRO_FUTURISM</strong></p>
</div>

---

## // SYSTEM_OVERVIEW

Orchestra OS is a high-fidelity dashboard console designed for managing, monitoring, and orchestrating autonomous AI agents. Built with a "retro-futuristic" blueprint aesthetic, it combines raw data visualization with module-based control cards.

**Key Modules:**
*   **SQUAD_UNITS (Dashboard)**: Real-time agent status grid, throughput monitoring, and rapid deployment tools.
*   **CORTEX-ANALYZER (Documentation)**: System specs, API references, and architectural blueprints.
*   **LOGIC-GATE (CLI)**: Direct terminal access for raw log streams and system overrides.

## // TECH_STACK

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS |
| Build | Vite 6 with code splitting |
| Backend | Express 5 |
| Database | SQLite via Prisma 7 |
| Charts | Recharts 3 |

## // INITIALIZATION_PROTOCOL

Follow these directives to initialize the local environment.

### 01. Prerequisites
Ensure your terminal is equipped with the following runtimes:
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   pnpm (recommended) or npm

### 02. Install Dependencies
Execute the following command to hydrate the `node_modules` sector:

```bash
pnpm install
```

### 03. Database Initialization
Initialize the SQLite database with Prisma:

```bash
npx prisma migrate dev
```

### 04. System Launch
Initiate the development servers (frontend + backend):

```bash
pnpm dev
```

Access the console via `http://localhost:3000`

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite + Express concurrently |
| `pnpm build` | Build frontend for production |
| `pnpm preview` | Preview production build |
| `pnpm start:server` | Start Express server only |

## // API_REFERENCE

RESTful endpoints served on port 3001 (proxied via Vite):

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/agents` | List all agents |
| `POST` | `/api/agents` | Create new agent |
| `PUT` | `/api/agents/:id/status` | Update agent status |
| `GET` | `/api/logs` | Get recent logs (100 max) |
| `POST` | `/api/logs` | Create log entry |

## // AGENT_STATUS_CODES

| Status | Description |
|--------|-------------|
| `RUNNING` | Agent is actively processing |
| `IDLE` | Agent is waiting for tasks |
| `ERROR` | Agent encountered an error |
| `OFFLINE` | Agent is terminated |

## // LOG_LEVELS

| Level | Description |
|-------|-------------|
| `INF` | Informational message |
| `WRN` | Warning |
| `ERR` | Error |
| `FAT` | Fatal error |
| `SYS` | System message |
| `USR` | User action |

## // OPERATIONAL_GUIDE

### Dashboard Navigation
*   **Deploy Agent**: Use the "NEW_DEPLOYMENT" button in the sidebar to spawn new agent instances.
*   **Search Protocol**: Use the header input `QUERY_AGENT_REGISTRY...` to filter active units by name or role.
*   **Unit Control**:
    *   **PLAY**: Resume agent execution (Status: RUNNING).
    *   **PAUSE**: Halt agent execution (Status: IDLE).
    *   **TERMINATE**: Kill agent process (Status: OFFLINE).

### Visual Customization
The interface uses a strict Tailwind CSS configuration for its unique look.
*   **Colors**: Defined in `tailwind.config.ts` (e.g., `gb-bg0`, `li-primary`).
*   **Fonts**: Uses `JetBrains Mono` (Monospace) and `Space Grotesk` (Display).

## // PERFORMANCE_METRICS

The build is optimized for production:

| Metric | Value |
|--------|-------|
| Initial Bundle | 214 KB (gzipped: 66 KB) |
| Vendor Charts | 303 KB (gzipped: 93 KB) |
| Dashboard Chunk | 28 KB |
| CLI Chunk | 9 KB |
| Docs Chunk | 3 KB |
| Build Time | ~1.4s |

**Optimization Features:**
- Code splitting with React.lazy()
- Vendor chunking (react, recharts)
- Component memoization (React.memo)
- Stable handlers (useCallback)
- Conditional intervals (view-aware)

## // DOCUMENTATION

*   [Architecture Guide](docs/ARCHITECTURE.md) - System design and optimization details
*   [API Documentation](docs/API.md) - Component props and endpoint reference

---

<div align="center">
  <p><em>"Harmonizing Syntax and Silicon"</em></p>
  <p>© 2024 Orchestra Operations</p>
</div>
