import { FigmaComponentSet, ValidationFinding, ComponentType } from '../types/figma';

/**
 * List of interactive components that require accessibility labels.
 */
export const InteractiveComponents: ComponentType[] = ['Button', 'Input'];

/**
 * Valid accessibility property names to check.
 */
const ACCESSIBILITY_PROPERTIES = ['aria-label', 'accessibilityLabel', 'ariaLabel'];

/**
 * Extended ValidationFinding with suggested fix.
 */
export interface AccessibilityFinding extends ValidationFinding {
    suggestedFix?: string;
}

/**
 * Validates that interactive Figma components have accessibility labels.
 *
 * @param componentSet - The Figma component set to validate
 * @returns Array of validation findings for missing accessibility properties
 */
export function validateAccessibility(componentSet: FigmaComponentSet): AccessibilityFinding[] {
    const findings: AccessibilityFinding[] = [];
    const { componentType, variants, id } = componentSet;

    // Skip validation for non-interactive components
    if (!InteractiveComponents.includes(componentType)) {
        return findings;
    }

    // Check if any variant has an accessibility label
    const hasAccessibilityLabel = variants.some((variant) =>
        ACCESSIBILITY_PROPERTIES.some((prop) =>
            Object.keys(variant.properties).some(
                (key) => key.toLowerCase() === prop.toLowerCase()
            )
        )
    );

    if (!hasAccessibilityLabel) {
        findings.push({
            type: 'Error',
            message: 'Missing accessibility label',
            nodeId: id,
            rule: 'accessibility-validation',
            suggestedFix: 'aria-label',
        });
    }

    return findings;
}
