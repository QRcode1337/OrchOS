# AGENTS_LOG // CORTEX_OS_V4.2.0

## // MISSION_OBJECTIVE
Orchestra OS is the central nervous system for autonomous agent orchestration. It provides a visual and command-driven interface for managing LLM-driven units in a high-fidelity, retro-futuristic environment.

## // NAMING_CONVENTION_CLEANUP
- **DEPRECATED**: `VOID ARRAY`, `VOID-ANALYZER`, `VOID ANALYZER`
- **CURRENT**: `CORTEX`, `CORTEX-ANALYZER`, `CORTEX ANALYZER`
- **RATIONALE**: The naming has been unified under the "CORTEX" umbrella to better reflect the system's role as the central processing hub for agent knowledge and synthesis.

## // RECENT_DEBUG_LOGS [2024-02-02]
### Issue: native-module-mismatch
- **Symptoms**: `prisma.agent.findMany()` fails with a `better-sqlite3` native module error.
- **Root Cause**: `better-sqlite3` was compiled against NODE_MODULE_VERSION 127 (Node 20) but executed in an environment requiring VERSION 141 (Node 23+).
- **Resolution**: 
    1. Ensure Node.js is correctly available in the system `PATH`.
    2. Force reinstall dependencies to trigger native module recompilation: `pnpm install`.
    3. Regenerate Prisma client: `npx prisma generate`.
    4. Verify connection using `tsx check_db.ts`.

## // INSTRUCTIONS_FOR_FUTURE_AGENTS
### 1. Aesthetic Integrity
Maintain the `gb-bg0` / `gb-fg` color scheme. Use `font-mono` for all data streams and `font-display` for headers. All UI elements should feel like they belong on a CRT monitor in a 1980s sci-fi bunker.

### 2. State Management
When adding new agents or logs, ensure they are persisted via the Prisma backend. Mock data in `constants.ts` should only be used as a fallback or for initial state bootstrapping.

### 3. CORTEX Protocol
The "CORTEX-ANALYZER" (formerly Void Analyzer) is the primary knowledge synthesis module. Any new features related to global memory or cross-agent knowledge should be integrated into the `AgentSynthesis.tsx` view.

### 4. Environment Sanity
If you encounter native module errors (SQLite, etc.), check the Node version used for installation vs runtime. Always use `pnpm` where available.

---
**LINK: ESTABLISHED**
**STATUS: OPERATIONAL**
**AGENTS_SYNC: COMPLETE**
