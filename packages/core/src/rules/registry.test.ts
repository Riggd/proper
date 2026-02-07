import { describe, it, expect } from 'vitest';
import { getComponentSchema, identifyComponent, ComponentRegistry } from './registry';
import { ButtonSchema, InputSchema, CardSchema, ComponentSchema } from './schemas';

describe('Component Registry', () => {
    describe('getComponentSchema', () => {
        it('returns ButtonSchema for type "Button"', () => {
            expect(getComponentSchema('Button')).toBe(ButtonSchema);
        });

        it('returns InputSchema for type "Input"', () => {
            expect(getComponentSchema('Input')).toBe(InputSchema);
        });

        it('returns CardSchema for type "Card"', () => {
            expect(getComponentSchema('Card')).toBe(CardSchema);
        });

        it('returns ComponentSchema for type "Unknown"', () => {
            expect(getComponentSchema('Unknown')).toBe(ComponentSchema);
        });

        it('returns ComponentSchema for an unregistered type', () => {
            // @ts-ignore - testing runtime fallback
            expect(getComponentSchema('NonExistent')).toBe(ComponentSchema);
        });
    });

    describe('identifyComponent', () => {
        it('identifies a Button node', () => {
            expect(identifyComponent({ name: 'Button Primary' })).toBe('Button');
        });

        it('identifies an Input node', () => {
            expect(identifyComponent({ name: 'Input Field' })).toBe('Input');
        });

        it('identifies a Card node', () => {
            expect(identifyComponent({ name: 'Card Container' })).toBe('Card');
        });

        it('identifies an unknown node', () => {
            expect(identifyComponent({ name: 'Some random frame' })).toBe('Unknown');
        });
    });
});
