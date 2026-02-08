/**
 * Protected words and naming conventions for Figma component variants.
 * 
 * Based on design system best practices and Figma conventions.
 */

/**
 * Reserved variant property names that have special meaning in design systems.
 */
export const VARIANT_PROPERTY_RESERVED = [
    'Type',
    'Size',
    'State',
    'Variant',
    'Hierarchy',
    'Style',
] as const;

export type VariantPropertyName = (typeof VARIANT_PROPERTY_RESERVED)[number];

/**
 * Standardized state values for component variants.
 */
export const STATE_VALUES = [
    'Default',
    'Hover',
    'Active',
    'Pressed',
    'Focused',
    'Disabled',
    'Loading',
    'Error',
    'Success',
] as const;

export type StateValue = (typeof STATE_VALUES)[number];

/**
 * Standardized size values for component variants.
 */
export const SIZE_VALUES = [
    'XS',
    'SM',
    'MD',
    'LG',
    'XL',
    '2XL',
] as const;

export type SizeValue = (typeof SIZE_VALUES)[number];

/**
 * Code-only prop naming conventions organized by category.
 */
export const CODE_ONLY_PROP_PREFIXES = {
    /** Accessibility-related props */
    accessibility: ['aria-', 'accessibilityLabel', 'role'],
    /** Testing-related props */
    testing: ['testID', 'data-testid'],
    /** Behavior/event-related props */
    behavior: ['onPress', 'onClick', 'onChange'],
} as const;

/**
 * Result of prop naming validation.
 */
export interface PropNamingValidation {
    valid: boolean;
    suggestion?: string;
    reason?: string;
}

/**
 * Validate that a property name follows naming conventions.
 * 
 * @param name - The property name to validate
 * @returns Validation result with suggestion if invalid
 */
export function validatePropNaming(name: string): PropNamingValidation {
    // Check for incorrect camelCase accessibility props (should be kebab-case)
    if (name.toLowerCase().startsWith('aria') && !name.startsWith('aria-')) {
        return {
            valid: false,
            suggestion: name.replace(/^aria/i, 'aria-'),
            reason: 'ARIA properties should use kebab-case (e.g., aria-label not ariaLabel)',
        };
    }

    // Check for spaces in property names
    if (name.includes(' ')) {
        return {
            valid: false,
            suggestion: name.replace(/\s+/g, '-'),
            reason: 'Property names should not contain spaces',
        };
    }

    return { valid: true };
}

/**
 * Check if a variant property name is a reserved/standard name.
 * 
 * @param name - The property name to check
 * @returns True if the name is a reserved variant property
 */
export function isReservedVariantProperty(name: string): boolean {
    return VARIANT_PROPERTY_RESERVED.some(
        (reserved) => reserved.toLowerCase() === name.toLowerCase()
    );
}

/**
 * Check if a state value is a standard state.
 * 
 * @param value - The state value to check
 * @returns True if the value is a standard state
 */
export function isStandardState(value: string): boolean {
    return STATE_VALUES.some(
        (state) => state.toLowerCase() === value.toLowerCase()
    );
}

/**
 * Check if a size value is a standard size.
 * 
 * @param value - The size value to check
 * @returns True if the value is a standard size
 */
export function isStandardSize(value: string): boolean {
    return SIZE_VALUES.some(
        (size) => size.toLowerCase() === value.toLowerCase()
    );
}
