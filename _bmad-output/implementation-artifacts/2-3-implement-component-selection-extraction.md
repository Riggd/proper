# Story 2.3: Implement Component Selection & Extraction

**Status:** ready-for-dev

## User Story

**As a** Product Designer,
**I want** the plugin to recognize when I select a Button, Input, or Card,
**So that** it knows which validation rules to apply.

## Acceptance Criteria

1. **Given** I select a Component Set in Figma
2. **When** I click "Audit" in the plugin
3. **Then** the plugin extracts the full layer tree as JSON
4. **And** identifies the component type (e.g., "Button") based on the name
5. **And** if I select a non-component frame or an ambiguous selection, it shows an "Unknown Component" state instead of crashing

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `apps/plugin/src/main/extractors`.
- **Figma API:** `figma.currentPage.selection`.

### Implementation Details
- **Extractor Logic:** Recursive function to traverse the selected node and build a JSON representation compatible with `packages/core` requirements.
- **Sanitization:** Ensure we only extract what is needed (id, name, type, children, minimal props) to keep payload small.

## Tasks

- [ ] Implement selection listener in Main thread.
- [ ] Implement `extractNodeRecursive(node)` function.
- [ ] Map Figma nodes to `ComponentSchema`.
- [ ] Handle "Unknown Component" cases gracefully.

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)
