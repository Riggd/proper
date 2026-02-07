# Story 2.4: Connect Audit Loop (Plugin -> Proxy -> Result)

**Status:** ready-for-dev

## User Story

**As a** Product Designer,
**I want** to see a Pass/Fail scorecard after auditing a component,
**So that** I know what needs to be fixed.

## Acceptance Criteria

1. **Given** I have selected a component and clicked "Audit"
2. **When** the Proxy returns the audit results
3. **Then** the UI updates to show a "Score" (0-100) and a list of issues
4. **And** findings are visually grouped by Severity (Errors must be fixed, Warnings are optional)
5. **And** the "Auditing" spinner disappears (<5s total time)

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `apps/plugin/src/ui` (Display), `apps/plugin/src/main` (Network).
- **Communication:** REST call to Proxy.

### Implementation Details
- **Network Request:** `fetch` from Plugin UI (or Main if needed, but UI usually has network access in Figma plugins).
- **Scorecard UI:** Component to display the results clearly.
- **Error Handling:** Handle network errors or proxy timeouts.

## Tasks

- [ ] Implement `auditService` in Plugin UI to call Proxy.
- [ ] Build `Scorecard` UI component.
- [ ] Implement loading states.
- [ ] Wiring: Selection -> Extract -> API Call -> Display Results.

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)
