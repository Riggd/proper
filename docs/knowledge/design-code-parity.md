# Design-Code Parity & "Code Only" Props

## 1. The Core Concept: 1:1 Parity
True design system maturity is reached when the component API in Figma exactly matches the component API in code (React/Vue/Web Components). This "1:1 Parity" reduces translation errors, speeds up developer handoff, and enables automated scaffolding.

### The "Gap"
Figma is a visual tool. Code is logical.
- **Visuals**: `color`, `size`, `border-radius` (Easy to map)
- **Logic**: `aria-label`, `role`, `loading` state behavior, `slots`, `data-testid` (Hard to map)

To bridge this gap, we use **"Code Only Props"**.

---

## 2. Technique: "Code Only Props" in Figma
User "Code Only Props" to capture data that has no visual representation in Figma but is *critical* for the component's proper implementation in code.

### How to Implement
1.  **Create a Container**: Inside your main component, create a Frame or Group named `👻 Code Props` or `⚙️ Props`.
2.  **Hide It**: Set this container's opacity to `0%` or toggle visibility off (caution: some plugins ignore invisible layers, zero opacity is safer).
3.  **Add Properties**:
    -   **Text Props**: Create text layers inside this container. Bind their content to a **Figma Component Property**.
        -   Name the property strictly (e.g., `accessibilityLabel`, `trackingId`, `htmlType`).
    -   **Boolean Props**: For logic that doesn't change visuals (e.g., `focusTrapEnabled`), bind a layer's visibility to a boolean prop.
    -   **Enum Props**: Use **Variant Properties** on the main component even if they don't change the look (less common), or use "Instance Swap" of a "Prop Definition" component.

### Common Code-Only Props
| Prop Name | Figma Mapping | Description |
| :--- | :--- | :--- |
| `aria-label` | Text Property | Essential for icon-only buttons. |
| `id` / `testId` | Text Property | Automation hooks for QA/Testing. |
| `href` | Text Property | Destination URL if component is polymorphic (as `<a>`). |
| `htmlType` | Text Property | `submit`, `reset`, or `button`. |
| `role` | Text Property | ARIA role overrides. |

---

## 3. Technique: Slots (Instance Swaps)
React components often take `children` or specific "slots" (e.g., `leftIcon`, `content`, `footer`).
In Figma, use **Instance Swap Properties** to achieve parity.

-   **React**: `<Button leftIcon={<Icon />}>Label</Button>`
-   **Figma**:
    1.  Create a "Slot" component (placeholder).
    2.  Place it inside the Button.
    3.  Create an **Instance Swap** property named `leftIcon`.
    4.  Bind the slot instance to this property.

**Benefit**: Developers see `leftIcon` in the generic Figma properties panel, matching exactly the prop they need to write.

---

## 4. Industry Standards (Benchmarks)

### Shopify Polaris
**Strategy**: Strict API Parity.
-   **Approach**: Figma component properties are named *exactly* like their React prop counterparts.
-   **Handling Content**: Heavy use of "Slots" via Instance Swaps to manage complex content injection without breaking the component shell.

### IBM Carbon
**Strategy**: Annotation Layers.
-   **Approach**: Uses specific "Redline" or "Annotation" components placed on top of designs to document behavior (focus order, keyboard interactions) that Figma can't simulate.

### Material Design 3 (M3)
**Strategy**: State Parity via Tokens.
-   **Approach**: Maps Figma "State" variants (Hover, Pressed, Dragged) directly to CSS state selectors (`:hover`, `:active`) using shared Design Tokens.

---

## 5. Recommended "Brain" Implementation
For the Proper "Brain" / Rules Engine to work effectively:

1.  **Parse Hidden Layers**: The Figma Plugin extractor must specifically look for the `👻 Code Props` layer.
2.  **Schema Validation**: The extracted props must be validated against `packages/core/rules.json`.
3.  **Linting**: Warn designers if required logic (like `aria-label` on an Icon Button) is empty.
