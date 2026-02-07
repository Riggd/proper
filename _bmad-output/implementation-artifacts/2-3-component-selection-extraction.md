# Story 2.3: Component Selection & Extraction

## Status
- [x] Expand message protocol for deep extraction
- [x] Implement deep extraction (layout, geometry, variables)
- [x] Handle recursive children for component sets
- [x] Map variable bindings to properties for validation

## Dev Agent Record
- Expanded `SelectionInfo` to capture `padding`, `itemSpacing`, `cornerRadius`, and `boundVariables`.
- Updated sandbox `extractNodeInfo` to recursively process `COMPONENT_SET` children.
- Implemented `variable:` prefixing in `transform.ts` to signal token usage to the core engine.
- Verified extraction logic via successful build and core engine parity.

## File List
- `apps/plugin/src/shared/messages.ts` (Updated)
- `apps/plugin/src/plugin/main.ts` (Updated)
- `apps/proxy/src/lib/transform.ts` (Updated)
- `packages/core/src/rules/tokenUsageValidation.ts` (Updated)

## Change Log
- **Plugin Shared:** Added layout and variable fields to `SelectionInfo`.
- **Plugin Sandbox:** Enhanced `extractNodeInfo` to capture Figma layout and variable bindings.
- **Proxy Transform:** Updated `RawFigmaNode` and `extractVariantProperties` to handle new deep fields.
- **Core Engine:** Modified `tokenUsageValidation` to respect variable bindings.
