# Story 2.1: Plugin UI Scaffold & Communication

**Status:** review

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

- [x] Scaffold `apps/plugin` UI with React.
- [x] Implement basic message passing (UI <-> Main).
- [x] Design the "Idle" state UI.
- [x] Verify plugin runs in Figma (or via Plugma mock).

## Dev Agent Record

### Implementation Plan
- Created proper Figma plugin architecture with UI/sandbox separation
- Typed message protocol for safe communication
- React UI with 4 states: idle, selected, auditing, results
- CSS using Figma theme variables for native look

### Completion Notes
- ✅ Sandbox code detects selection and posts to UI
- ✅ UI listens for messages and updates state
- ✅ Build produces `index.html` (UI) and `code.js` (sandbox)
- ✅ Plugin builds successfully (UI: 148KB, Sandbox: 1.4KB)

## File List

**New:**
- `apps/plugin/src/shared/messages.ts` - Message types
- `apps/plugin/src/plugin/main.ts` - Figma sandbox code
- `apps/plugin/src/ui/App.tsx` - React UI component
- `apps/plugin/src/ui/App.css` - Styles

**Modified:**
- `apps/plugin/src/main.tsx` - Entry point
- `apps/plugin/vite.config.ts` - Build config
- `apps/plugin/package.json` - Scripts & deps
- `apps/plugin/manifest.json` - Plugin manifest

## Change Log

- 2026-02-07: Implemented plugin UI scaffold with message passing

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)

