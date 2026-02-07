# Feature Implementation Spec: Cortex Dev Console

## Visual Dictionary
- **Background**: `#0a0a0a` (Deep Void)
- **Primary Accents**: `#cc3300` (Signal Red), `#ffcc00` (Warning Yellow)
- **Secondary Accents**: `#8ec07c` (Cyber Aqua), `#458588` (Neural Blue)
- **Fonts**: `JetBrains Mono` (Logs), `Space Grotesk` (Labels)
- **Spacing**: Rigid grid-based (8px units)

## Layout Structure
### High-Level Mesh
- **Main Container**: Flex-col, full height.
- **Top Sector (65%)**: `[VERBOSE_LOGS_STREAM]`
    - Scrollable terminal window.
    - ANSI color support.
    - Hover-to-inspect log entries.
- **Bottom Sector (35%)**: `[AI_CHATROOM_LOBBY]`
    - Chat bubble interface for inter-agent communication.
    - Command injection input at the bottom.
- **Sidebar (Right, 320px)**:
    - `CLUSTER_ANALYSIS`: Static metrics (Entropy Index, Token Velocity).
    - `LIVE_PROTOCOLS`: Checkbox status list.
    - `SYSTEM_HEALTH`: Sparkline/mini-bar chart.

## Interaction Design
- **Command Injection**: Pressing `Enter` or clicking `EXECUTE` sends a message to the chat lobby and adds a `USR_ACT` log to the stream.
- **Log Hover**: Subtle highlight of connected chat messages when hovering over an agent's log.
- **Resizing**: (Optional phase 2) Draggable divider between logs and chat.

## Technical Implementation
- **View**: `views/CortexDevConsole.tsx`
- **Component Updates**:
    - Refactor `LogStream.tsx` to be reusable or extend it.
    - Create `ChatLobby.tsx` for the messaging interface.
    - Create `StatsSidebar.tsx` for the right-hand metrics.

## Accessibility Checklist
- [ ] High contrast text nodes.
- [ ] ARIA roles for log stream (log) and chat (chat).
- [ ] Keyboard focus for the command input.
