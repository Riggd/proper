import { describe, it, expect } from 'vitest';
import { validateAccessibility, InteractiveComponents } from './accessibilityValidation';
import { FigmaComponentSet } from '../types/figma';

describe('validateAccessibility', () => {
    describe('Button component', () => {
        it('should return error when missing accessibility label', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    { id: '1:2', name: 'State=Default', properties: {} },
                ],
            };

            const findings = validateAccessibility(componentSet);

            expect(findings).toContainEqual(
                expect.objectContaining({
                    type: 'Error',
                    message: 'Missing accessibility label',
                    suggestedFix: 'aria-label',
                })
            );
        });

        it('should pass when aria-label is present', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    {
                        id: '1:2',
                        name: 'State=Default',
                        properties: { 'aria-label': 'Submit button' }
                    },
                ],
            };

            const findings = validateAccessibility(componentSet);

            expect(findings).toEqual([]);
        });

        it('should pass when accessibilityLabel is present', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    {
                        id: '1:2',
                        name: 'State=Default',
                        properties: { 'accessibilityLabel': 'Submit' }
                    },
                ],
            };

            const findings = validateAccessibility(componentSet);

            expect(findings).toEqual([]);
        });
    });

    describe('Input component', () => {
        it('should return error when missing accessibility label', () => {
            const componentSet: FigmaComponentSet = {
                id: '2:1',
                name: 'Input',
                type: 'COMPONENT_SET',
                componentType: 'Input',
                variants: [
                    { id: '2:2', name: 'State=Default', properties: {} },
                ],
            };

            const findings = validateAccessibility(componentSet);

            expect(findings).toContainEqual(
                expect.objectContaining({
                    type: 'Error',
                    message: 'Missing accessibility label',
                })
            );
        });
    });

    describe('Non-interactive component', () => {
        it('should skip validation for Card component', () => {
            const componentSet: FigmaComponentSet = {
                id: '3:1',
                name: 'Card',
                type: 'COMPONENT_SET',
                componentType: 'Card',
                variants: [
                    { id: '3:2', name: 'Variant=Default', properties: {} },
                ],
            };

            const findings = validateAccessibility(componentSet);

            expect(findings).toEqual([]);
        });
    });
});

describe('InteractiveComponents', () => {
    it('should include Button as interactive', () => {
        expect(InteractiveComponents).toContain('Button');
    });

    it('should include Input as interactive', () => {
        expect(InteractiveComponents).toContain('Input');
    });
});
