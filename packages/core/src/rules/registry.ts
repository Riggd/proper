import { z } from 'zod';
import { ButtonSchema, InputSchema, CardSchema, ComponentSchema } from './schemas';
import { ComponentType } from '../types/figma';

export const ComponentRegistry = {
    Button: ButtonSchema,
    Input: InputSchema,
    Card: CardSchema,
};

export function getComponentSchema(type: ComponentType): z.ZodType<any> {
    switch (type) {
        case 'Button':
            return ButtonSchema;
        case 'Input':
            return InputSchema;
        case 'Card':
            return CardSchema;
        default:
            return ComponentSchema;
    }
}

export function identifyComponent(node: { name: string }): ComponentType {
    if (node.name.startsWith('Button')) return 'Button';
    if (node.name.startsWith('Input')) return 'Input';
    if (node.name.startsWith('Card')) return 'Card';
    return 'Unknown';
}
