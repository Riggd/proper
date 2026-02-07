import { describe, it, expect } from 'vitest';
import {
    validateTokenUsage,
    TokenMap,
    findClosestToken
} from './tokenUsageValidation';
import { FigmaComponentSet } from '../types/figma';

describe('validateTokenUsage', () => {
    describe('border-radius validation', () => {
        it('should return warning when hardcoded border-radius does not match token', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    {
                        id: '1:2',
                        name: 'State=Default',
                        properties: { 'border-radius': '7px' }
                    },
                ],
            };

            const findings = validateTokenUsage(componentSet);

            expect(findings).toContainEqual(
                expect.objectContaining({
                    type: 'Warning',
                    message: 'Hardcoded value detected: 7px',
                    suggestedToken: 'radius.md',
                })
            );
        });

        it('should pass when border-radius matches a token', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    {
                        id: '1:2',
                        name: 'State=Default',
                        properties: { 'border-radius': '8px' }
                    },
                ],
            };

            const findings = validateTokenUsage(componentSet);

            expect(findings).toEqual([]);
        });
    });

    describe('spacing validation', () => {
        it('should return warning for padding value not matching token', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    {
                        id: '1:2',
                        name: 'State=Default',
                        properties: { 'padding': '15px' }
                    },
                ],
            };

            const findings = validateTokenUsage(componentSet);

            expect(findings).toContainEqual(
                expect.objectContaining({
                    type: 'Warning',
                    message: 'Hardcoded value detected: 15px',
                })
            );
        });
    });
});

describe('findClosestToken', () => {
    it('should find closest radius token for 7px', () => {
        const result = findClosestToken(7, 'radius');
        expect(result).toEqual({ name: 'radius.md', value: 8 });
    });

    it('should find exact match for spacing', () => {
        const result = findClosestToken(16, 'spacing');
        expect(result).toEqual({ name: 'spacing.md', value: 16 });
    });

    it('should return undefined for values too far from any token', () => {
        const result = findClosestToken(1000, 'radius');
        expect(result).toBeUndefined();
    });
});

describe('TokenMap', () => {
    it('should define radius tokens', () => {
        expect(TokenMap.radius).toBeDefined();
        expect(TokenMap.radius['radius.md']).toBe(8);
    });

    it('should define spacing tokens', () => {
        expect(TokenMap.spacing).toBeDefined();
        expect(TokenMap.spacing['spacing.md']).toBe(16);
    });
});
