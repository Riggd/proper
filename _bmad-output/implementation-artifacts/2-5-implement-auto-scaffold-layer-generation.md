# Story 2.5: Implement "Auto-Scaffold" Layer Generation

**Status:** ready-for-dev

## User Story

**As a** Product Designer,
**I want** to click "Auto-Fix" to automatically generate missing property layers,
**So that** I don't have to manually create weird hidden frames like "Code Only Props".

## Acceptance Criteria

1. **Given** an audit result with a missing "accessibilityLabel" prop
2. **When** I click the "Auto-Scaffold" button
3. **Then** the plugin creates a new variant property or hidden layer structure in Figma
4. **And** specifically creates a Frame named `"Code only props"` containing text layers for each prop (Nathan Curtis pattern)
5. **And** the component structure matches the "Code Only Props" spec

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `apps/plugin/src/main/generators`.
- **Figma API:** Write access (`createFrame`, `createText`).

### Implementation Details
- **Generator Logic:** Function to create the specific "Code Only Props" structure.
- **Positioning:** Place it sensibly within the component/variant.
- **Locks:** Ensure these layers are locked/hidden as per the spec.

## Tasks

- [ ] Implement `generateCodeOnlyPropsFrame` function.
- [ ] Handle "Auto-Fix" message from UI.
- [ ] Apply changes to the Figma document.
- [ ] Verify structure matches NC spec.

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)
