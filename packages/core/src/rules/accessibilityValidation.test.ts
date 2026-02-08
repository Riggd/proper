import { describe, it, expect } from 'vitest';
import {
    validateAccessibility,
    InteractiveComponents,
    detectButtonVariant,
    ButtonVariantType
} from './accessibilityValidation';
import { FigmaComponentSet, FigmaVariant } from '../types/figma';

describe('detectButtonVariant', () => {
    it('should detect icon-only button from variant name', () => {
        const variant: FigmaVariant = {
            id: '1:1',
            name: 'Type=Icon-Only',
            properties: {},
        };

        expect(detectButtonVariant(variant)).toBe('icon-only');
    });

    it('should detect icon-only button from icon property', () => {
        const variant: FigmaVariant = {
            id: '1:1',
            name: 'State=Default',
            properties: { Icon: 'search' },
        };

        expect(detectButtonVariant(variant)).toBe('icon-only');
    });

    it('should detect text button when no icon indicators', () => {
        const variant: FigmaVariant = {
            id: '1:1',
            name: 'State=Default',
            properties: { Label: 'Submit' },
        };

        expect(detectButtonVariant(variant)).toBe('text');
    });

    it('should detect icon-text button with both properties', () => {
        const variant: FigmaVariant = {
            id: '1:1',
            name: 'State=Default',
            properties: { Icon: 'check', Label: 'Confirm' },
        };

        expect(detectButtonVariant(variant)).toBe('icon-text');
    });

    it('should default to text for ambiguous variants', () => {
        const variant: FigmaVariant = {
            id: '1:1',
            name: 'State=Default',
            properties: {},
        };

        expect(detectButtonVariant(variant)).toBe('text');
    });
    it('should ignore common variant keys when checking for text content', () => {
        const variant: FigmaVariant = {
            id: '1:1',
            name: 'State=Default, Size=Medium',
            properties: {
                State: 'Default',
                Size: 'Medium',
                Icon: 'search',
            },
        };

        expect(detectButtonVariant(variant)).toBe('icon-only');
    });

    it('should NOT ignore variant keys if they look like text content (e.g. Label)', () => {
        const variant: FigmaVariant = {
            id: '1:1',
            name: 'State=Default',
            properties: {
                State: 'Default',
                Label: 'Submit',
            },
        };

        expect(detectButtonVariant(variant)).toBe('text');
    });
});

describe('validateAccessibility', () => {
    describe('Button component - text buttons', () => {
        it('should pass for text button without aria-label (gets name from text)', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    { id: '1:2', name: 'State=Default', properties: { Label: 'Submit' } },
                ],
            };

            const findings = validateAccessibility(componentSet);

            expect(findings).toEqual([]);
        });

        it('should pass for text button even without any properties', () => {
            // Empty properties defaults to text button assumption (conservative)
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

            expect(findings).toEqual([]);
        });
    });

    describe('Button component - icon-only buttons', () => {
        it('should return error for icon-only button missing aria-label', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Icon Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    { id: '1:2', name: 'Type=Icon-Only', properties: { Icon: 'search' } },
                ],
            };

            const findings = validateAccessibility(componentSet);

            expect(findings).toContainEqual(
                expect.objectContaining({
                    type: 'Error',
                    message: 'Icon-only button variant(s) missing accessibility label',
                    suggestedFix: 'aria-label',
                    reason: expect.stringContaining('screen readers'),
                })
            );
        });

        it('should pass for icon-only button with aria-label', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Icon Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    {
                        id: '1:2',
                        name: 'Type=Icon-Only',
                        properties: { Icon: 'search', 'aria-label': 'Search' }
                    },
                ],
            };

            const findings = validateAccessibility(componentSet);

            expect(findings).toEqual([]);
        });

        it('should pass for icon-only button with accessibilityLabel', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    {
                        id: '1:2',
                        name: 'Type=Icon-Only',
                        properties: { Icon: 'close', accessibilityLabel: 'Close' }
                    },
                ],
            };

            const findings = validateAccessibility(componentSet);

            expect(findings).toEqual([]);
        });
        it('should require aria-label for icon-only button even when variant props are present', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Icon Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    {
                        id: '1:2',
                        name: 'State=Default, Size=Medium',
                        properties: {
                            State: 'Default',
                            Size: 'Medium',
                            Icon: 'IconInstance',
                        },
                    },
                ],
            };

            const findings = validateAccessibility(componentSet);

            const ariaLabelFinding = findings.find(f => f.suggestedFix === 'aria-label');
            expect(ariaLabelFinding).toBeDefined();
            expect(ariaLabelFinding?.message).toContain('Icon-only button variant(s) missing accessibility label');
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

        it('should pass when aria-label is present', () => {
            const componentSet: FigmaComponentSet = {
                id: '2:1',
                name: 'Input',
                type: 'COMPONENT_SET',
                componentType: 'Input',
                variants: [
                    { id: '2:2', name: 'State=Default', properties: { 'aria-label': 'Email' } },
                ],
            };

            const findings = validateAccessibility(componentSet);

            expect(findings).toEqual([]);
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
