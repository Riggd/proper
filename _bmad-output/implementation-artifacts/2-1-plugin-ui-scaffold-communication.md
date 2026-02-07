# Story 2.1: Plugin UI Scaffold & Communication

**Status:** ready-for-dev

## User Story

**As a** Product Designer,
**I want** to open the Propper plugin in Figma and see a clean interface,
**So that** I can start the auditing process.

## Acceptance Criteria

1. **Given** I have the Propper plugin installed
2. **When** I run the plugin
3. **Then** the UI opens with an "Idle" state prompting me to select a component
4. **And** the UI establishes a message stream with the plugin sandbox (main thread)

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `apps/plugin/src/ui` (React/ShadCN), `apps/plugin/src/main` (Sandbox).
- **Tooling:** Vite, Plugma.

### Implementation Details
- **UI Framework:** React with ShadCN/Tailwind.
- **Communication:** Bi-directional message passing between UI (iframe) and Main (sandbox).
- **State Management:** Simple local state or small context for UI.

## Tasks

- [ ] Scaffold `apps/plugin` UI with React.
- [ ] Implement basic message passing (UI <-> Main).
- [ ] Design the "Idle" state UI.
- [ ] Verify plugin runs in Figma (or via Plugma mock).

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)
