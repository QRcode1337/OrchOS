---
description: Create a comprehensive build guide for a specific feature using UI/UX Pro Max intelligence
---

# Feature Implementation Spec Workflow

This workflow helps you research and plan a specific feature (e.g., "Login Page", "Dashboard", "Settings Modal") ensuring high-quality UI/UX before implementation.

1.  **Define Feature Scope**
    *   **Feature Name:** (e.g., "User Profile Settings")
    *   **Tech Stack:** (e.g., `html-tailwind`, `react`, `nextjs`) - *Default: html-tailwind*
    *   **Context:** Briefly describe what this feature does.

2.  **Research UI/UX Best Practices**
    *   Run the following search commands (replace keywords as needed) to gather "Pro" intelligence:
    
    *   **UX Guidelines:**
        ```bash
        python3 .agent/skills/ui-ux-pro-max/scripts/search.py "[feature keywords] accessibility" --domain ux
        ```
    
    *   **Component Patterns:**
        ```bash
        python3 .agent/skills/ui-ux-pro-max/scripts/search.py "[feature keywords] layout" --domain landing
        ```

    *   **Stack Specifics:**
        ```bash
        python3 .agent/skills/ui-ux-pro-max/scripts/search.py "[feature keywords]" --stack [Tech Stack]
        ```

3.  **Synthesize Implementation Spec**
    *   **Action for Agent:** Create a new file `specs/[feature-name]-spec.md` (or similar) containing:
        *   **Visual Dictionary:** Colors, font sizes, and spacing to use (referencing `design-system/MASTER.md` if it exists).
        *   **Interaction Design:** Hover states, focus states, transitions.
        *   **Accessibility Checklist:** ARIA labels, keyboard navigation requirements.
        *   **Technical Implementation:** component structure, state management tips (from the stack search).

4.  **Ready to Build**
    *   You now have a "blueprint" for the feature.
    *   Proceed to write the code following the spec.
