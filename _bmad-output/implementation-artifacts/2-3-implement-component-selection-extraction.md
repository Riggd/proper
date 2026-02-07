# Story 2.3: Implement Component Selection & Extraction

**Status:** review

## User Story

**As a** Product Designer,
**I want** the plugin to recognize when I select a Button, Input, or Card,
**So that** it knows which validation rules to apply.

## Acceptance Criteria

1. ✅ **Given** I select a Component Set in Figma
2. ✅ **When** I click "Audit" in the plugin
3. ✅ **Then** the plugin extracts the full layer tree as JSON
4. ✅ **And** identifies the component type (e.g., "Button") based on the name
5. ✅ **And** if I select a non-component frame or an ambiguous selection, it shows an "Unknown Component" state instead of crashing

## Dev Agent Record

### Implementation Summary
- **Selection Listener:** Implemented in `apps/plugin/src/plugin/main.ts` using `figma.on('selectionchange')`.
- **Deep Extraction:** Created `extractNodeInfo(node)` function that recursively extracts layout, geometry, and variable bindings.
- **Component Type Detection:** `getComponentType(name)` identifies Button, Input, Card, or Unknown from the node name.
- **Variable Binding Support:** Added `getBoundVariables(node)` to detect Figma Variables (design tokens).
- **Transform Integration:** Updated `apps/proxy/src/lib/transform.ts` to handle the new deep properties and mark bound variables with `variable:` prefix.

### Files Modified
- `apps/plugin/src/plugin/main.ts` - Deep extraction with recursive children for COMPONENT_SET
- `apps/plugin/src/shared/messages.ts` - Extended SelectionInfo with layout/geometry/variable fields
- `apps/proxy/src/lib/transform.ts` - Updated RawFigmaNode and property mapping
- `packages/core/src/rules/tokenUsageValidation.ts` - Skip validation for variable-bound properties

## Tasks

- [x] Implement selection listener in Main thread.
- [x] Implement `extractNodeRecursive(node)` function (as `extractNodeInfo`).
- [x] Map Figma nodes to `ComponentSchema`.
- [x] Handle "Unknown Component" cases gracefully.

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)

