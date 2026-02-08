import { FigmaComponentSet, ValidationFinding, ComponentType } from '../types/figma';

/**
 * Configuration for required boolean states per component type.
 * This can be extended or modified based on design system requirements.
 */
export const RequiredStates: Record<Exclude<ComponentType, 'Unknown'>, string[]> = {
    Button: ['disabled', 'loading'],
    Input: ['disabled', 'error'],
    Card: ['disabled'],
};

/**
 * Validates that a Figma Component Set contains all required boolean states
 * for its component type.
 *
 * @param componentSet - The Figma component set to validate
 * @returns Array of validation findings for missing states
 */
export function validateBooleanState(componentSet: FigmaComponentSet): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    const { componentType, variants } = componentSet;

    // Skip validation for unknown component types
    if (componentType === 'Unknown') {
        return findings;
    }

    const requiredStates = RequiredStates[componentType] ?? [];

    for (const state of requiredStates) {
        const hasState = checkForState(variants, state);

        if (!hasState) {
            findings.push({
                type: 'Error',
                message: `Missing required state: ${state}`,
                nodeId: componentSet.id,
                rule: 'boolean-state-validation',
                suggestedFix: state,
            });
        }
    }

    return findings;
}

/**
 * Checks if any variant in the component set has the specified state.
 * Looks for patterns like "Disabled=True", "Loading=True", etc.
 */
function checkForState(variants: FigmaComponentSet['variants'], state: string): boolean {
    const normalizedState = state.toLowerCase();

    return variants.some((variant) => {
        // Check variant name for pattern like "Disabled=True"
        const nameMatch = variant.name.toLowerCase().includes(`${normalizedState}=true`);

        // Check variant properties for the state
        const propertyMatch = Object.entries(variant.properties).some(
            ([key, value]) =>
                key.toLowerCase() === normalizedState && value.toLowerCase() === 'true'
        );

        return nameMatch || propertyMatch;
    });
}
