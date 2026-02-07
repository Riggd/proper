import { FigmaComponentSet } from '../types/figma';
import { validateBooleanState } from './booleanStateValidation';
import { validateAccessibility, AccessibilityFinding } from './accessibilityValidation';
import { validateTokenUsage, TokenFinding } from './tokenUsageValidation';

/**
 * Package version for parity checks across workspaces.
 */
export const VERSION = '1.0.0';

/**
 * Type-safe severity mapping from ValidationFinding type to AuditFinding severity.
 */
const SEVERITY_MAP: Record<string, 'error' | 'warning' | 'info'> = {
    Error: 'error',
    Warning: 'warning',
    Info: 'info',
};

/**
 * Normalized finding with severity field as required by AC.
 */
export interface AuditFinding {
    severity: 'error' | 'warning' | 'info';
    message: string;
    nodeId?: string;
    rule?: string;
    suggestedFix?: string;
    suggestedToken?: string;
}

/**
 * Result of validating a component.
 */
export interface AuditResult {
    componentId: string;
    componentName: string;
    passed: boolean;
    findings: AuditFinding[];
    validatedAt: string;
    version: string;
}

/**
 * Aggregates all validation rules and returns a unified AuditResult.
 *
 * @param componentSet - The Figma component set to validate
 * @returns Unified audit result with all findings
 */
export function validate(componentSet: FigmaComponentSet): AuditResult {
    const findings: AuditFinding[] = [];

    // Run boolean state validation
    const booleanFindings = validateBooleanState(componentSet);
    for (const finding of booleanFindings) {
        findings.push({
            severity: SEVERITY_MAP[finding.type] ?? 'info',
            message: finding.message,
            nodeId: finding.nodeId,
            rule: finding.rule,
        });
    }

    // Run accessibility validation
    const accessibilityFindings = validateAccessibility(componentSet) as AccessibilityFinding[];
    for (const finding of accessibilityFindings) {
        findings.push({
            severity: SEVERITY_MAP[finding.type] ?? 'info',
            message: finding.message,
            nodeId: finding.nodeId,
            rule: finding.rule,
            suggestedFix: finding.suggestedFix,
        });
    }

    // Run token usage validation
    const tokenFindings = validateTokenUsage(componentSet) as TokenFinding[];
    for (const finding of tokenFindings) {
        findings.push({
            severity: SEVERITY_MAP[finding.type] ?? 'info',
            message: finding.message,
            nodeId: finding.nodeId,
            rule: finding.rule,
            suggestedToken: finding.suggestedToken,
        });
    }

    // Determine if validation passed (no errors)
    const hasErrors = findings.some((f) => f.severity === 'error');

    return {
        componentId: componentSet.id,
        componentName: componentSet.name,
        passed: !hasErrors,
        findings,
        validatedAt: new Date().toISOString(),
        version: VERSION,
    };
}
