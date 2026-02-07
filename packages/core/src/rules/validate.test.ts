import { describe, it, expect } from 'vitest';
import {
    validate,
    AuditResult,
    AuditFinding,
    VERSION
} from './validate';
import { FigmaComponentSet } from '../types/figma';

describe('validate', () => {
    describe('valid component', () => {
        it('should return 0 errors for a valid Button with all requirements', () => {
            const validButton: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    {
                        id: '1:2',
                        name: 'Disabled=True',
                        properties: {
                            Disabled: 'True',
                            'aria-label': 'Submit',
                            'border-radius': '8px',
                        }
                    },
                    {
                        id: '1:3',
                        name: 'Loading=True',
                        properties: { Loading: 'True' }
                    },
                ],
            };

            const result = validate(validButton);

            expect(result.findings.filter((f: AuditFinding) => f.severity === 'error')).toHaveLength(0);
            expect(result.passed).toBe(true);
        });
    });

    describe('invalid component', () => {
        it('should return expected errors for Button missing disabled state', () => {
            const invalidButton: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    { id: '1:2', name: 'State=Default', properties: {} },
                ],
            };

            const result = validate(invalidButton);

            expect(result.findings.filter((f: AuditFinding) => f.severity === 'error').length).toBeGreaterThan(0);
            expect(result.passed).toBe(false);
        });

        it('should return warning for hardcoded border-radius', () => {
            const buttonWithHardcodedValue: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    {
                        id: '1:2',
                        name: 'Disabled=True,Loading=True',
                        properties: {
                            Disabled: 'True',
                            Loading: 'True',
                            'aria-label': 'Submit',
                            'border-radius': '7px',
                        }
                    },
                ],
            };

            const result = validate(buttonWithHardcodedValue);

            expect(result.findings.filter((f: AuditFinding) => f.severity === 'warning')).toContainEqual(
                expect.objectContaining({
                    message: 'Hardcoded value detected: 7px',
                })
            );
        });
    });
});

describe('AuditResult', () => {
    it('should include severity field in findings', () => {
        const component: FigmaComponentSet = {
            id: '1:1',
            name: 'Button',
            type: 'COMPONENT_SET',
            componentType: 'Button',
            variants: [],
        };

        const result = validate(component);

        for (const finding of result.findings) {
            expect(['error', 'warning', 'info']).toContain(finding.severity);
        }
    });
});

describe('VERSION', () => {
    it('should export a version field', () => {
        expect(VERSION).toBeDefined();
        expect(typeof VERSION).toBe('string');
    });
});
