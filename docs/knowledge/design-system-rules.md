# Design System Rules & Guidelines

This document outlines the core rules for component construction, property usage, and naming conventions within the design system. These rules are intended to be enforced by the linting engine to ensuring design-code parity.

## 1. Code Only Props

"Code Only Props" are properties that represent logic or metadata needed for development but have no visual impact in Figma. They are implemented using the **Nathan Curtis** pattern to bridge the gap between design visuals and code logic.

### Implementation Pattern
To add a code-only prop to a component:
1.  **Container:** Create a **Frame** named `Code only props` (or `⚙️ Props`) inside the component.
2.  **Visibility:** Set dimensions to `0.01` x `0.01` (virtually invisible) and position at `(0, 0)`.
3.  **Content:** Set to **Clip content**.
4.  **Layers:** Inside this frame, add **Text Layers** for each property.
5.  **Binding:** Bind the *content* of these text layers to Figma Component Properties.

### Common Code-Only Props
| Prop Name | Figma Mapping | Description |
| :--- | :--- | :--- |
| `accessibilityLabel` | Text Property | Screen reader label (e.g., `aria-label`). Essential for icon-only buttons. |
| `testId` | Text Property | ID hook for QA automation (e.g., `data-testid`). |
| `role` | Text Property | ARIA role override (e.g., `button`, `link`). |
| `htmlType` | Text Property | HTML attribute for buttons (e.g., `submit`, `reset`). |

---

## 2. Proper Variant Usage

Variants should be strictly used for *visual style variations*, while *states* and *content* should be handled as Properties. This prevents "variant explosion" and aligns with code props.

### ✅ Do
*   Use **Boolean Properties** for binary states.
    *   *Example:* `disabled=true/false`, `loading=true/false`, `error=true/false`.
*   Use **Text Properties** for content strings.
*   Use specific prop names for variant categories.
    *   *Example:* `variant` (primary, secondary), `size` (sm, md, lg).

### ❌ Don't
*   **Don't** create separate variant permutations for simple boolean toggles (e.g., `State=Disabled`).
*   **Don't** mix structural props (like `size`) with stylistic props (like `color`) in the same variant property if they can be orthogonal.

---

## 3. Protected Words (Reserved Keywords)

Certain property names are **reserved** because they conflict with code keywords (React/HTML/JS/TypeScript) or internal tool logic. These names must not be used as component property names.

### Restricted Names List

| Name | Conflict Reason | Recommended Alternative |
| :--- | :--- | :--- |
| `type` | Conflicts with TypeScript `type` keyword and Flash/ActionScript legacies in some systems. | `variant`, `kind`, `style`, `category` |
| `class` | Conflicts with HTML `class` attribute and JS `class` keyword. | `className`, `styleClass` |
| `default` | Reserved keyword in JavaScript/Switch statements. | `defaultValue`, `initialValue` |
| `key` | Reserved by React for list rendering. | `id`, `uniqueId` |
| `children` | Reserved by React for nested content (though sometimes acceptable if intent matches). | `text`, `content`, `label` |

### Slot Configuration Reserved Words
When defining slots, avoid:
*   `items`
*   `anyOf`
