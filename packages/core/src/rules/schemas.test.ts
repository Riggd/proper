import { describe, it, expect } from 'vitest';
import { ButtonSchema, InputSchema, CardSchema, ComponentSchema } from './schemas';

describe('Component Schemas', () => {
    it('validates a generic component', () => {
        const component = {
            id: '1:1',
            name: 'Frame 1',
            type: 'FRAME',
        };
        const result = ComponentSchema.safeParse(component);
        expect(result.success).toBe(true);
    });

    it('validates a Button', () => {
        const button = {
            id: '1:2',
            name: 'Button Primary',
            type: 'INSTANCE',
        };
        const result = ButtonSchema.safeParse(button);
        expect(result.success).toBe(true);
    });

    it('fails Button validation with incorrect name', () => {
        const notButton = {
            id: '1:3',
            name: 'Not A Button',
            type: 'INSTANCE',
        };
        const result = ButtonSchema.safeParse(notButton);
        expect(result.success).toBe(false);
    });

    it('validates an Input', () => {
        const input = {
            id: '1:4',
            name: 'Input Field',
            type: 'INSTANCE'
        };
        const result = InputSchema.safeParse(input);
        expect(result.success).toBe(true);
    });

    it('validates a Card', () => {
        const card = {
            id: '1:5',
            name: 'Card Container',
            type: 'INSTANCE'
        };
        const result = CardSchema.safeParse(card);
        expect(result.success).toBe(true);
    });
});
