# Feature Spec: CORTEX_CLI & NEURAL_MAP

## 1. Feature Name: **CORTEX_CLI**
**Keywords:** agent-command-hub, neural-visualization, slash-commands

## 2. Context & Scope
The user requires a more powerful and integrated way to interact with agents beyond point-and-click. Inspired by the failed `claude /agents` command, this feature provides an in-app **CORTEX_CLI** that supports slash commands and a **NEURAL_MAP** that visualizes the "Knowledge Synthesis" (disparate data points) as an interactive network graph.

## 3. Visual Dictionary (Ref: Orchestra OS Design System)
*   **Primary Background:** `#0d0f14` (Deep Dark)
*   **CLI Text:** `#aeadaf` (System Mono)
*   **Node Colors:**
    *   **Agent Node:** `#ff003c` (Pulse Red)
    *   **Memory Node:** `#00f5ff` (Neon Cyan)
    *   **Synthesis Node:** `#ffcc00` (Warning Yellow)
*   **Typography:** `JetBrains Mono` or `Roboto Mono` for CLI; `Inter` for metadata overlays.

## 4. Technical Implementation (Spec)

### A. The CLI Interaction (CMD Hub)
*   **Input Field:** A bottom-sticky input with a prefix like `ORCHESTRA> _`.
*   **Slash Commands:**
    *   `/agents`: Lists all active units and their status.
    *   `/memory [agent_id]`: Fetches persistent memory bank for a specific unit.
    *   `/synthesize`: Triggers a manual convergence process in the Neural Map.
    *   `/clear`: Purges the local terminal buffer.
*   **State Management:** React local state for command buffer; integration with existing `/api/agents` and `/api/memory` endpoints.

### B. The Neural Map (Visualization)
*   **Component:** `NeuralGraph.tsx`
*   **Engine:** `d3-force` or `react-force-graph`.
*   **Visual Logic:**
    *   **Nodes:** Represent Agents and MemoryEntries.
    *   **Edges:** Lines linking MemoryEntries to their parent Agents.
    *   **Dynamic Force:** As "Knowledge Convergence" increases, nodes pull closer to a central "CORTEX" hub.
    *   **Interactivity:** Hovering a node displays a "Artifact Popup" with the `key` and `value` of the memory.

### C. UX & Accessibility Checklist
*   **Accessibility:** Ensure terminal output is ARIA-live (polite).
*   **Focus Management:** `Tab` key should cycle between Command Input and active Node Clusters.
*   **Transitions:** Smooth node movement (300ms) during synthesis; CLI text fade-in.

## 5. Prototype Mockup Prompt
"A futuristic dark-mode dashboard featuring a terminal window labeled CORTEX_CLI on the right and a glowing cyan network graph labeled NEURAL_MAP on the left. Binary code scanlines overlay the terminal. Neon aqua lines connect red agent nodes to blue data points."
