# "Code Only" Props in Figma
By Nathan Curtis
Source: https://nathanacurtis.substack.com/p/code-only-props-in-figma

## Executive Summary
This article details a technique for adding "code only props" to Figma components to better connect system designers with their users and system developer counterparts. It addresses the gap where Figma properties focus on visual outcomes while developers need broader API definitions including accessibility, behavior, and non-visual logic.

## The Challenge
System designers face several challenges with Figma's native property limitations:
1. Need to specify non-visual accessibility and configurations
2. Desire to maximize API shape for automation and deterministic processes
3. Need to expose non-visual props for product designer intent
4. Need to clarify relationships between visual and non-visual props
5. Need to improve synchronization between Figma and code libraries

## The Solution
The proposed solution involves adding a hidden structure within Figma components to capture these properties.

### Step 1: Code-only props layer
Create a practically hidden frame/layer:
- Location: Child of component root
- Name: "Code only props"
- Dimensions: 0.01 x 0.01
- Position: (0,0)
- Content: Clipped

### Step 2: Nest a layer per prop
Inside this hidden layer, add text layers or nested instances that correspond to specific props.
- **Example:** For an `aria-label` or `accessibilityLabel`, add a text layer bound to a component property named "Accessibility label".
- **Visibility:** Keep the layer visible if the product designer needs to see/edit it in the props panel. Hide it if it's purely for the system/handoff but static.

### Step 3: Integration
Tools and handoff scripts can read these layers to generate specification data.
- Infer types (string, number, enum) based on default values or nested instance variants.
- Omit this structure from the visual generation code.
- Add these props to the canonical component specification (contract).

## Examples

### Accessibility Label
- **Prop Name:** `accessibilityLabel`
- **Figma Implementation:** Text property bound to a text layer in the hidden code-only frame.
- **Code Output:** `components: button: props: accessibilityLabel: type: string`

### Image src and altText
- **Props:** `src`, `altText`
- **Figma Implementation:** Two text layers bound to respective properties.
- **Usage:** Designer might only see `altText` to fill in, while `src` might be handled by the system or hidden.

### Heading Semantic Level
- **Props:** `as` (tag), `level` (visual style)
- **Figma Implementation:** A nested instance of a utility component with variants for `h1` through `h6`.
- **Usage:** Allows separating the semantic structure (`as="h3"`) from the visual presentation (`level="2"`).

### Slot Configuration
- **Props:** `items`, `minItems`, `maxItems`, `anyOf` (allowed children)
- **Figma Implementation:** Text layers defining constraints (e.g., `items minItems` layer with text "1").
- **Usage:** Defines that a Checkbox Group must have at least one child, and that child must be a Checkbox.

## Tradeoffs
### Pros
- ✅ Improves visibility of component props to product designers
- ✅ Enables system designers to shape more of the component API directly in Figma

### Cons
- ❌ Complicates Figma assets structure
- ❌ Adds friction during component definition (need to decide what to expose)
