import { z } from 'zod';

const BaseNode = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
});

// Base schema for all components
export const ComponentSchema: z.ZodObject<any, any, any> = BaseNode.extend({
    children: z.lazy(() => z.array(ComponentSchema)).optional(),
});

// Specific schemas
export const ButtonSchema = ComponentSchema.extend({
    name: z.string().refine((val) => val.startsWith('Button'), {
        message: "Node name must start with 'Button'",
    }),
});

export const InputSchema = ComponentSchema.extend({
    name: z.string().refine((val) => val.startsWith('Input'), {
        message: "Node name must start with 'Input'",
    }),
});

export const CardSchema = ComponentSchema.extend({
    name: z.string().refine((val) => val.startsWith('Card'), {
        message: "Node name must start with 'Card'",
    }),
});

export type ComponentSchemaType = z.infer<typeof ComponentSchema>;
export type ButtonSchemaType = z.infer<typeof ButtonSchema>;
export type InputSchemaType = z.infer<typeof InputSchema>;
export type CardSchemaType = z.infer<typeof CardSchema>;
