import { FigmaComponentSet, FigmaVariant, ValidationFinding, ComponentType } from '../types/figma';
import { COMPONENT_PROP_RULES, PropRuleContext, ComponentPropRule } from './componentPropsRules';

/**
 * Extended ValidationFinding with suggested fix and reason.
 */
export interface ComponentPropsFinding extends ValidationFinding {
    suggestedFix?: string;
    reason?: string;
}

/**
 * Accessibility property names (to exclude from general prop validation).
 * These are handled by accessibilityValidation.ts
 */
const ACCESSIBILITY_PROPS = ['aria-label', 'accessibilityLabel', 'ariaLabel'];

/**
 * Analyze variant to build context for rule evaluation.
 */
function buildPropRuleContext(variant: FigmaVariant, componentType: ComponentType): PropRuleContext {
    const props = variant.properties;
    const name = variant.name.toLowerCase();

    // Check for icon indicators
    const hasIcon = Object.entries(props).some(([key, value]) => {
        const k = key.toLowerCase();
        const v = String(value).toLowerCase();
        return k.includes('icon') || v.includes('icon');
    });

    // Check for text content indicators
    const hasTextContent = Object.entries(props).some(([key, value]) => {
        const k = key.toLowerCase();
        return k.includes('label') || k.includes('text') || k.includes('title') ||
            (typeof value === 'string' && value.length > 0 && !k.includes('icon'));
    }) || name.includes('text') || (!name.includes('icon') && !hasIcon);

    return {
        componentType,
        hasTextContent,
        hasIcon,
        variantProperties: props,
    };
}

/**
 * Check if a variant has a specific property.
 */
function hasProperty(variant: FigmaVariant, propName: string): boolean {
    return Object.keys(variant.properties).some(
        key => key.toLowerCase() === propName.toLowerCase()
    );
}

/**
 * Validate component props based on the componentPropsRules.
 * 
 * Checks each variant for required props (excluding accessibility props
 * which are handled by accessibilityValidation.ts).
 */
export function validateComponentProps(componentSet: FigmaComponentSet): ComponentPropsFinding[] {
    const findings: ComponentPropsFinding[] = [];
    const { componentType, variants, id } = componentSet;

    const rules = COMPONENT_PROP_RULES[componentType] || [];

    // Skip if no rules for this component type
    if (rules.length === 0) {
        return findings;
    }

    // Filter out accessibility props (handled elsewhere) and get non-a11y rules
    const nonA11yRules = rules.filter(rule =>
        !ACCESSIBILITY_PROPS.includes(rule.prop.toLowerCase())
    );

    // Check each non-accessibility rule
    for (const rule of nonA11yRules) {
        // For rules with conditions, we need to evaluate per-variant
        if (rule.condition) {
            const variantsNeedingProp = variants.filter(variant => {
                const context = buildPropRuleContext(variant, componentType);
                return rule.condition!(context) && !hasProperty(variant, rule.prop);
            });

            if (variantsNeedingProp.length > 0) {
                findings.push({
                    type: 'Warning', // Conditional props are warnings, not errors
                    message: `Missing recommended prop: ${rule.prop}`,
                    nodeId: id,
                    rule: 'component-props-validation',
                    suggestedFix: rule.prop,
                    reason: rule.rationale,
                });
            }
        } else if (rule.required) {
            // For always-required props, check if ANY variant has it
            const hasProp = variants.some(variant => hasProperty(variant, rule.prop));

            if (!hasProp) {
                findings.push({
                    type: 'Error',
                    message: `Missing required prop: ${rule.prop}`,
                    nodeId: id,
                    rule: 'component-props-validation',
                    suggestedFix: rule.prop,
                    reason: rule.rationale,
                });
            }
        } else {
            // Optional props - suggest but don't require
            const hasProp = variants.some(variant => hasProperty(variant, rule.prop));

            if (!hasProp) {
                findings.push({
                    type: 'Info',
                    message: `Consider adding: ${rule.prop}`,
                    nodeId: id,
                    rule: 'component-props-validation',
                    suggestedFix: rule.prop,
                    reason: rule.rationale,
                });
            }
        }
    }

    return findings;
}
