import { z } from 'zod';
import { ButtonSchema, InputSchema, CardSchema, ComponentSchema } from './schemas';
import { ComponentType } from '../types/figma';

export const ComponentRegistry = {
    Button: ButtonSchema,
    Input: InputSchema,
    Card: CardSchema,
};

export function getComponentSchema(type: ComponentType): z.ZodType<any> {
    return (ComponentRegistry as Record<string, z.ZodType<any>>)[type] ?? ComponentSchema;
}

export function identifyComponent(node: { name: string }): ComponentType {
    for (const type of Object.keys(ComponentRegistry)) {
        if (node.name.startsWith(type)) return type as ComponentType;
    }
    return 'Unknown';
}
