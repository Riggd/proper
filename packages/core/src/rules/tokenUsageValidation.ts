import { FigmaComponentSet, ValidationFinding } from '../types/figma';

/**
 * Token map with categories and their token name/value pairs.
 */
export const TokenMap: Record<string, Record<string, number>> = {
    radius: {
        'radius.none': 0,
        'radius.sm': 4,
        'radius.md': 8,
        'radius.lg': 12,
        'radius.xl': 16,
        'radius.full': 9999,
    },
    spacing: {
        'spacing.none': 0,
        'spacing.xs': 4,
        'spacing.sm': 8,
        'spacing.md': 16,
        'spacing.lg': 24,
        'spacing.xl': 32,
        'spacing.2xl': 48,
    },
};

/**
 * Properties that should be validated against design tokens.
 */
const TOKEN_PROPERTIES: Record<string, keyof typeof TokenMap> = {
    'border-radius': 'radius',
    'borderRadius': 'radius',
    'padding': 'spacing',
    'margin': 'spacing',
    'gap': 'spacing',
};

/**
 * Maximum distance from a token value for a suggestion to be made.
 */
const MAX_SUGGESTION_DISTANCE = 4;

/**
 * Extended ValidationFinding with suggested token.
 */
export interface TokenFinding extends ValidationFinding {
    suggestedToken?: string;
    suggestedValue?: number;
}

/**
 * Finds the closest matching token for a given value.
 */
export function findClosestToken(
    value: number,
    category: keyof typeof TokenMap
): { name: string; value: number } | undefined {
    const tokens = TokenMap[category];
    if (!tokens) return undefined;

    let closest: { name: string; value: number; distance: number } | undefined;

    for (const [name, tokenValue] of Object.entries(tokens)) {
        const distance = Math.abs(value - tokenValue);

        if (!closest || distance < closest.distance) {
            closest = { name, value: tokenValue, distance };
        }
    }

    // Only suggest if within reasonable distance
    if (closest && closest.distance <= MAX_SUGGESTION_DISTANCE) {
        return { name: closest.name, value: closest.value };
    }

    return undefined;
}

/**
 * Parses a CSS value string to extract numeric value.
 */
function parseValue(valueStr: string): number | undefined {
    const match = valueStr.match(/^(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : undefined;
}

/**
 * Validates that Figma components use design tokens instead of hardcoded values.
 *
 * @param componentSet - The Figma component set to validate
 * @returns Array of validation findings for hardcoded values
 */
export function validateTokenUsage(componentSet: FigmaComponentSet): TokenFinding[] {
    const findings: TokenFinding[] = [];
    const { variants, id } = componentSet;

    for (const variant of variants) {
        for (const [propKey, propValue] of Object.entries(variant.properties)) {
            const category = TOKEN_PROPERTIES[propKey];
            if (!category) continue;

            const numericValue = parseValue(propValue);
            if (numericValue === undefined) continue;

            const tokens = TokenMap[category];
            const isValidToken = Object.values(tokens).includes(numericValue);

            if (!isValidToken) {
                const closestMatch = findClosestToken(numericValue, category);

                findings.push({
                    type: 'Warning',
                    message: `Hardcoded value detected: ${propValue}`,
                    nodeId: id,
                    rule: 'token-usage-validation',
                    suggestedToken: closestMatch?.name,
                    suggestedValue: closestMatch?.value,
                });
            }
        }
    }

    return findings;
}
