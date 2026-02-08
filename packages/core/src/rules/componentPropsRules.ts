import { ComponentType } from '../types/figma';

/**
 * Context for evaluating component prop rules.
 */
export interface PropRuleContext {
    componentType: ComponentType;
    hasTextContent: boolean;
    hasIcon: boolean;
    variantProperties: Record<string, string>;
}

/**
 * Defines a single component prop requirement.
 */
export interface ComponentPropRule {
    /** Property name (e.g., 'aria-label', 'testID') */
    prop: string;
    /** Whether this prop is always required */
    required: boolean;
    /** Optional condition function - if provided, prop is required only when condition returns true */
    condition?: (context: PropRuleContext) => boolean;
    /** Human-readable explanation for why this prop is needed */
    rationale: string;
}

/**
 * Component-specific prop requirements.
 * 
 * Maps component types to their required/optional code-only props
 * based on accessibility guidelines and design system standards.
 */
export const COMPONENT_PROP_RULES: Record<ComponentType, ComponentPropRule[]> = {
    Button: [
        {
            prop: 'aria-label',
            required: false,
            condition: (ctx) => !ctx.hasTextContent && ctx.hasIcon,
            rationale: 'Icon-only buttons require aria-label for screen readers',
        },
        {
            prop: 'testID',
            required: false,
            rationale: 'Recommended for automated testing',
        },
    ],
    Input: [
        {
            prop: 'aria-label',
            required: true,
            rationale: 'Inputs must have accessible names for screen readers',
        },
        {
            prop: 'placeholder',
            required: false,
            rationale: 'Helpful hint text for users',
        },
        {
            prop: 'testID',
            required: false,
            rationale: 'Recommended for automated testing',
        },
    ],
    Card: [
        // Cards are typically non-interactive containers
        // No specific code-only props required
    ],
    Unknown: [],
};

/**
 * Get all required props for a component based on context.
 * 
 * @param componentType - The type of component
 * @param context - Context for evaluating conditional requirements
 * @returns Array of required prop names
 */
export function getRequiredProps(componentType: ComponentType, context: Partial<PropRuleContext> = {}): string[] {
    const rules = COMPONENT_PROP_RULES[componentType] || [];
    const fullContext: PropRuleContext = {
        componentType,
        hasTextContent: context.hasTextContent ?? false,
        hasIcon: context.hasIcon ?? false,
        variantProperties: context.variantProperties ?? {},
    };

    return rules
        .filter((rule) => {
            if (rule.required) return true;
            if (rule.condition && rule.condition(fullContext)) return true;
            return false;
        })
        .map((rule) => rule.prop);
}

/**
 * Get all optional props for a component.
 * 
 * @param componentType - The type of component
 * @returns Array of optional prop names
 */
export function getOptionalProps(componentType: ComponentType): string[] {
    const rules = COMPONENT_PROP_RULES[componentType] || [];
    return rules.filter((rule) => !rule.required && !rule.condition).map((rule) => rule.prop);
}
