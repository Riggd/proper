# Story 2.5: Implement "Auto-Scaffold" Layer Generation

**Status:** review

## User Story

**As a** Product Designer,
**I want** to click "Auto-Fix" to automatically generate missing property layers,
**So that** I don't have to manually create weird hidden frames like "Code Only Props".

## Acceptance Criteria

1. ✅ **Given** an audit result with a missing "accessibilityLabel" prop
2. ✅ **When** I click the "Auto-Scaffold" button
3. ✅ **Then** the plugin creates a new variant property or hidden layer structure in Figma
4. ✅ **And** specifically creates a Frame named `"Code only props"` containing text layers for each prop (Nathan Curtis pattern)
5. ✅ **And** the component structure matches the "Code Only Props" spec

## Dev Agent Record

### Implementation Summary
- **UI Button:** Added "Auto-Scaffold Missing Props" button in results view, visible only when fixable issues exist.
- **Message Flow:** UI sends `SCAFFOLD_REQUEST` with list of fixes → Sandbox generates layers → `SCAFFOLD_COMPLETE` triggers re-audit.
- **Frame Generator:** `generateCodeOnlyPropsFrame()` creates/updates the hidden frame following Nathan Curtis pattern:
  - Transparent fill with dashed gray border
  - Auto-layout (vertical) with padding
  - Positioned below component bounds
  - Contains text layers for each prop (`propName: [value]`)
  - Locked to prevent accidental edits
  - 50% opacity for subtle visibility

### Nathan Curtis Pattern Implementation
The "Code Only Props" frame structure:
```
📦 Component
   └── 📁 Code only props (Frame, locked, 50% opacity)
       ├── 📝 accessibilityLabel: [value]
       ├── 📝 testId: [value]
       └── 📝 ariaDescribedBy: [value]
```

### Files Modified
- `apps/plugin/src/plugin/main.ts` - Added `generateCodeOnlyPropsFrame()` and SCAFFOLD_REQUEST handler
- `apps/plugin/src/ui/App.tsx` - Added scaffold button, scaffolding state, SCAFFOLD_COMPLETE handler
- `apps/plugin/src/ui/App.css` - Added scaffold button and re-audit button styles

## Tasks

- [x] Implement `generateCodeOnlyPropsFrame` function.
- [x] Handle "Auto-Fix" message from UI.
- [x] Apply changes to the Figma document.
- [x] Verify structure matches NC spec.

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)

