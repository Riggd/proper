
export interface FigmaNode {
    id: string;
    name: string;
    type: string;
    children?: FigmaNode[];
    // Additional properties can be added as needed
}

export interface FigmaVariant {
    id: string;
    name: string;
    properties: Record<string, string>;
}

export interface FigmaComponentSet {
    id: string;
    name: string;
    type: 'COMPONENT_SET';
    componentType: ComponentType;
    variants: FigmaVariant[];
}

export interface ValidationFinding {
    type: 'Error' | 'Warning' | 'Info';
    message: string;
    nodeId?: string;
    rule?: string;
}

export type ComponentType = 'Button' | 'Input' | 'Card' | 'Unknown';
