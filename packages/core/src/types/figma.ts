
export interface FigmaNode {
    id: string;
    name: string;
    type: string;
    children?: FigmaNode[];
    // Additional properties can be added as needed
}

export type ComponentType = 'Button' | 'Input' | 'Card' | 'Unknown';
