# Story 2.6: Optimistic UI & Polish

**Status:** ready-for-dev

## User Story

**As a** Product Designer,
**I want** the plugin to feel instant and magical,
**So that** it doesn't interrupt my design flow.

## Acceptance Criteria

1. **Given** I click "Auto-Scaffold"
2. **When** the operation starts
3. **Then** the UI immediately shows a "Fixed" state (optimistic update)
4. **And** the actual Figma layer change completes in the background (<1000ms perceived)
5. **And** if the backend operation fails, the UI reverts to the "Audit Failed" state and shows an error toast

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `apps/plugin/src/ui`.
- **Pattern:** Optimistic UI.

### Implementation Details
- **State Management:** Update local state immediately upon action.
- **Rollback:** Revert state if the Promise rejects.
- **Feedback:** Toast notifications for success/error.

## Tasks

- [ ] Implement optimistic state updates for Auto-Fix.
- [ ] Add toast notification system.
- [ ] Refine loading animations and transitions.

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)
