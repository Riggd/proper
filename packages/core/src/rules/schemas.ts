import { z } from 'zod';
import { FigmaNode } from '../types/figma';

const BaseNode = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
});

// Base schema for all components
export const ComponentSchema: z.ZodType<FigmaNode> = BaseNode.extend({
    children: z.lazy(() => z.array(ComponentSchema)).optional(),
});

// Specific schemas
export const ButtonSchema = BaseNode.extend({
    name: z.string().refine((val) => val.startsWith('Button'), {
        message: "Node name must start with 'Button'",
    }),
    children: z.lazy(() => z.array(ComponentSchema)).optional(),
});

export const InputSchema = BaseNode.extend({
    name: z.string().refine((val) => val.startsWith('Input'), {
        message: "Node name must start with 'Input'",
    }),
    children: z.lazy(() => z.array(ComponentSchema)).optional(),
});

export const CardSchema = BaseNode.extend({
    name: z.string().refine((val) => val.startsWith('Card'), {
        message: "Node name must start with 'Card'",
    }),
    children: z.lazy(() => z.array(ComponentSchema)).optional(),
});

export type ComponentSchemaType = z.infer<typeof ComponentSchema>;
export type ButtonSchemaType = z.infer<typeof ButtonSchema>;
export type InputSchemaType = z.infer<typeof InputSchema>;
export type CardSchemaType = z.infer<typeof CardSchema>;
