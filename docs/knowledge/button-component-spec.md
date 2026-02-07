# Button Component Specification

## 1. Component Overview
The Button is a fundamental interactive element that triggers actions or navigation. It communicates the importance of an action through its visual style (variant) and state.

## 2. Anatomy & Props

### Core Props
| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| `children` | ReactNode | - | The content of the button (label). |
| `variant` | String | 'primary' | Visual style: `primary`, `secondary`, `outline` (or `ghost`), `text`, `danger`. |
| `size` | String | 'md' | Size preset: `sm`, `md`, `lg`. affects padding and font-size. |
| `disabled` | Boolean | false | Disables interaction and applies disabled visual state. |
| `loading` | Boolean | false | Shows a loading spinner and disables interaction. Replaces or overlays label. |
| `type` | String | 'button' | HTML button type: `button`, `submit`, `reset`. |
| `onClick` | Function | - | Handler for click events. |

### Composition Props
| Prop Name | Type | Description |
|-----------|------|-------------|
| `leftIcon` | ReactNode | Icon element to render before the label. |
| `rightIcon` | ReactNode | Icon element to render after the label. |
| `fullWidth` | Boolean | If true, the button stretches to 100% of its container. |

## 3. Variants & Visual Styles

### Primary
- **Use Case**: Main action on a screen (e.g., "Save", "Submit", "Sign Up").
- **Style**: High contrast background color, light text.

### Secondary
- **Use Case**: Alternative actions (e.g., "Cancel", "Back").
- **Style**: Lower contrast background (often gray or transparent with border), dark text.

### Outline / Ghost
- **Use Case**: Lower priority actions, typically used in groups.
- **Style**: Transparent background, colored border and text.

### Text / Link
- **Use Case**: Lowest priority, subtle actions.
- **Style**: No background/border, colored text (underline on hover often).

### Icon Only
- **Use Case**: Space-constrained actions (e.g., toolbar buttons).
- **Requirement**: Must include `aria-label` for accessibility.

## 4. States
The component must visually and functionally support the following states:

1.  **Default**: Resting state.
2.  **Hover**: Cursor pointer, slight color shift or elevation change.
3.  **Active (Pressed)**: Visual feedback of activation (scale down or color darken).
4.  **Focus**: Visible focus ring (outline) for keyboard navigation. **CRITICAL** for accessibility.
5.  **Disabled**:
    -   Visual: Reduced opacity or grayed out.
    -   Functional: `pointer-events: none`, `aria-disabled="true"`.
6.  **Loading**:
    -   Visual: Spinner visible, often replacing text or added to side.
    -   Functional: Button is effectively disabled (cannot click again).

## 5. Design to Dev Handoff

### Accessibility (a11y) checklist
- [ ] **Touch Target**: Minimum 44x44px (mobile) / 24x24px (desktop) click area.
- [ ] **Focus Ring**: Distinct focus indicator (e.g., 2px Blue ring with offset) for keyboard users.
- [ ] **Contrast**: Text vs Background ratio must be at least 4.5:1 (WCAG AA).
- [ ] **Labels**: Icon-only buttons MUST have a tooltip or `aria-label`.
- [ ] **Keyboard Support**: Full support for `Enter` and `Space` keys to activate.

### Design Tokens
Ensure implementation uses semantic tokens instead of hardcoded values:
-   **Color**: `color.action.primary.bg`, `color.action.primary.text`, etc.
-   **Spacing**: `space.2`, `space.4` for padding.
-   **Typography**: `text.body.md` or `text.button` label style.
-   **Radius**: `radius.md` or `radius.full`.

### Design-Code Parity Checklist
To ensure 1:1 parity between Figma and Code (ref: `docs/knowledge/design-code-parity.md`):

1.  **Code Only Props (Hidden Layers)**:
    -   [ ] Create a hidden `👻 Code Props` frame in the Figma component.
    -   [ ] Add text props for:
        -   `htmlType` (submit/reset/button)
        -   `aria-label` (for icon-only variants)
        -   `testId` (for QA automation)
        -   `role` (if overriding semantic defaults)
    -   [ ] Bind these instances to Figma Component Properties.

2.  **Slot Architecture (Instance Swaps)**:
    -   [ ] Use "Instance Swap" properties for `leftIcon` and `rightIcon`.
    -   [ ] Do NOT hardcode icons; allow swapping with any icon asset.

3.  **API Naming Alignment**:
    -   Figma Prop `Variant` -> Code Prop `variant`
    -   Figma Prop `Size` -> Code Prop `size`
    -   Figma Prop `State` (if used) -> Code Prop `disabled` / `loading` logic

### Implementation Notes
-   Use semantic `<button>` HTML element.
-   Avoid `<div>` with `onClick` unless absolutely necessary (requires extensive ARIA patching).
-   If used as a link (navigation), the component should be able to render as an `<a>` tag (polymorphic component) while maintaining button styling.

## 6. Resources & References
-   [Material Design Buttons](https://material.io/components/buttons)
-   [W3C Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
-   [React Patterns](https://www.patterns.dev/react/)
-   `docs/knowledge/button-audit-checklist.md` (MVP Audit Rules)
