import { FigmaComponentSet, FigmaVariant } from '@proper/core';

/**
 * Transform raw Figma node data into our FigmaComponentSet format.
 * This is the bridge between Figma's native structure and our validators.
 */
export interface RawFigmaNode {
    id: string;
    name: string;
    type: string;
    children?: RawFigmaNode[];
    // Layout
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    itemSpacing?: number;
    // Geometry
    cornerRadius?: number | 'mixed';
    // Tokens/Variables
    boundVariables?: Record<string, string>;
}

/**
 * Get component type from node name
 */
function getComponentType(name: string): 'Button' | 'Input' | 'Card' | 'Unknown' {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('button')) return 'Button';
    if (lowerName.includes('input') || lowerName.includes('textfield') || lowerName.includes('text field')) return 'Input';
    if (lowerName.includes('card')) return 'Card';
    return 'Unknown';
}

/**
 * Extract properties from a variant node
 */
function extractVariantProperties(node: RawFigmaNode): Record<string, string> {
    const properties: Record<string, string> = {};

    // Parse variant name (e.g., "State=Default, Size=Medium")
    const parts = node.name.split(',').map(p => p.trim());
    for (const part of parts) {
        const [key, value] = part.split('=').map(s => s?.trim());
        if (key && value) {
            properties[key] = value;
        }
    }

    // Map style properties
    if (node.cornerRadius !== undefined) {
        properties['border-radius'] = node.cornerRadius === 'mixed' ? 'mixed' : `${node.cornerRadius}px`;
    }
    if (node.paddingLeft !== undefined) properties['padding-left'] = `${node.paddingLeft}px`;
    if (node.paddingTop !== undefined) properties['padding-top'] = `${node.paddingTop}px`;
    if (node.paddingRight !== undefined) properties['padding-right'] = `${node.paddingRight}px`;
    if (node.paddingBottom !== undefined) properties['padding-bottom'] = `${node.paddingBottom}px`;
    if (node.itemSpacing !== undefined) properties['gap'] = `${node.itemSpacing}px`;

    // Overwrite with bound variables if they exist
    // This allows the validator to see that a token is being used
    if (node.boundVariables) {
        for (const [prop, variableId] of Object.entries(node.boundVariables)) {
            // Map Figma variable property names to our canonical property names
            const canonicalProp = prop === 'itemSpacing' ? 'gap' :
                prop === 'cornerRadius' ? 'border-radius' :
                    prop;
            properties[canonicalProp] = `variable:${variableId}`;
        }
    }

    // Look for accessibility labels in children
    const accessibilityChild = findAccessibilityLayer(node);
    if (accessibilityChild) {
        properties['aria-label'] = accessibilityChild;
    }

    return properties;
}

/**
 * Search for accessibility label in node tree
 */
function findAccessibilityLayer(node: RawFigmaNode): string | null {
    if (node.name.toLowerCase().includes('accessibilitylabel') ||
        node.name.toLowerCase().includes('aria-label')) {
        return node.name.split(':')[1]?.trim() || 'present';
    }

    if (node.children) {
        for (const child of node.children) {
            const found = findAccessibilityLayer(child);
            if (found) return found;
        }
    }

    return null;
}

/**
 * Transform Figma node to our FigmaComponentSet format
 */
export function transformFigmaNode(node: RawFigmaNode): FigmaComponentSet {
    const variants: FigmaVariant[] = [];

    // If this is a COMPONENT_SET, children are variants
    if (node.type === 'COMPONENT_SET' && node.children) {
        for (const child of node.children) {
            variants.push({
                id: child.id,
                name: child.name,
                properties: extractVariantProperties(child),
            });
        }
    } else {
        // Single component - treat as single variant
        variants.push({
            id: node.id,
            name: node.name,
            properties: extractVariantProperties(node),
        });
    }

    return {
        id: node.id,
        name: node.name,
        type: 'COMPONENT_SET',
        componentType: getComponentType(node.name),
        variants,
    };
}
