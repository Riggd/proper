import { FigmaComponentSet, ValidationFinding, ComponentType, FigmaVariant } from '../types/figma';

/**
 * List of interactive components that require accessibility labels.
 */
export const InteractiveComponents: ComponentType[] = ['Button', 'Input'];

/**
 * Valid accessibility property names to check.
 */
const ACCESSIBILITY_PROPERTIES = ['aria-label', 'accessibilityLabel', 'ariaLabel'];

/**
 * Button variant types for accessibility validation.
 */
export type ButtonVariantType = 'icon-only' | 'text' | 'icon-text';

/**
 * Extended ValidationFinding with suggested fix and educational reason.
 */
export interface AccessibilityFinding extends ValidationFinding {
    suggestedFix?: string;
    /** Educational explanation of WHY this matters for engineering */
    reason?: string;
}

/**
 * Detects if a button variant is icon-only (no text content).
 * 
 * Icon-only buttons require aria-label for screen readers.
 * Buttons with visible text get their accessible name from the text content.
 * 
 * @param variant - The Figma variant to analyze
 * @returns The button variant type
 */
export function detectButtonVariant(variant: FigmaVariant): ButtonVariantType {
    const props = variant.properties;
    const name = variant.name.toLowerCase();

    // Check variant properties for icon indicators
    const hasIconProp = Object.entries(props).some(([key, value]) => {
        const k = key.toLowerCase();
        const v = String(value).toLowerCase();
        return k.includes('icon') || v.includes('icon');
    });

    // Check for explicit text/label properties or naming
    // Exclude common variant/state properties from being counted as "text content"
    const EXCLUDED_VARIANT_KEYS = ['state', 'variant', 'size', 'style', 'mode', 'theme', 'type', 'status', 'priority'];

    // Check for explicit text/label properties or naming
    const hasTextProp = Object.entries(props).some(([key, value]) => {
        const k = key.toLowerCase();

        // Skip known variant keys
        if (EXCLUDED_VARIANT_KEYS.some(ex => k === ex || k === ex.toLowerCase())) return false;

        // Explicitly content-like keys
        if (k.includes('label') || k.includes('text') || k.includes('title') ||
            k.includes('content') || k.includes('placeholder') || k.includes('heading') ||
            k.includes('description') || k.includes('caption')) {
            return true;
        }

        const v = String(value).toLowerCase();
        // Look for label, text, title, or non-empty string content
        // (typeof value === 'string' && value.length > 0 && !k.includes('icon'));

        if (typeof value === 'string' && value.length > 0 && !k.includes('icon')) {
            // conservative check: if the key seems like a variant name, ignore it
            if (EXCLUDED_VARIANT_KEYS.some(ex => k.includes(ex))) return false;
            return true;
        }

        return false;
    });

    // Check naming convention: "Icon Button" or "IconButton" often indicates icon-only
    const nameIndicatesIconOnly =
        name.includes('icon-only') ||
        name.includes('icononly') ||
        (name.includes('icon') && !name.includes('text'));

    // Determination logic:
    // 1. If name explicitly says icon-only -> icon-only
    // 2. If has icon prop but no text prop -> likely icon-only
    // 3. If has text prop -> text or icon-text
    // 4. Default to text (safer assumption, reduces false positives)

    if (nameIndicatesIconOnly) {
        return 'icon-only';
    }

    if (hasIconProp && hasTextProp) {
        return 'icon-text';
    }

    if (hasIconProp && !hasTextProp) {
        // Be conservative: only flag as icon-only if there's clear evidence
        return 'icon-only';
    }

    return 'text';
}

/**
 * Checks if a variant has an accessibility label property.
 */
function hasAccessibilityLabel(variant: FigmaVariant): boolean {
    return ACCESSIBILITY_PROPERTIES.some((prop) =>
        Object.keys(variant.properties).some(
            (key) => key.toLowerCase() === prop.toLowerCase()
        )
    );
}

/**
 * Validates that interactive Figma components have appropriate accessibility labels.
 *
 * - Buttons with visible text do NOT need aria-label (text provides accessible name)
 * - Icon-only buttons DO need aria-label
 * - Input components always need accessibility labels
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

    // Handle Button components specially
    if (componentType === 'Button') {
        // Check each variant for icon-only buttons without accessibility labels
        const iconOnlyVariantsWithoutLabel = variants.filter((variant) => {
            const buttonType = detectButtonVariant(variant);
            return buttonType === 'icon-only' && !hasAccessibilityLabel(variant);
        });

        if (iconOnlyVariantsWithoutLabel.length > 0) {
            findings.push({
                type: 'Error',
                message: `Icon-only button variant(s) missing accessibility label`,
                nodeId: id,
                rule: 'accessibility-validation',
                suggestedFix: 'aria-label',
                reason: 'Icon-only buttons are invisible to screen readers without a label. ' +
                    'Engineers need aria-label to make the button accessible — without it, ' +
                    'users with disabilities cannot interact with your component.',
            });
        }

        // Text buttons and icon-text buttons are OK without aria-label
        // (they get accessible name from visible text)
        return findings;
    }

    // For Input and other interactive components, always require accessibility label
    const hasAnyAccessibilityLabel = variants.some((variant) => hasAccessibilityLabel(variant));

    if (!hasAnyAccessibilityLabel) {
        findings.push({
            type: 'Error',
            message: 'Missing accessibility label',
            nodeId: id,
            rule: 'accessibility-validation',
            suggestedFix: 'aria-label',
            reason: 'Input fields require accessible names for screen reader users. ' +
                'Without aria-label, engineers cannot make this component WCAG compliant, ' +
                'and users with disabilities will struggle to understand what this field is for.',
        });
    }

    return findings;
}

