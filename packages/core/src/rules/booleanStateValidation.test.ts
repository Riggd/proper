import { describe, it, expect } from 'vitest';
import { validateBooleanState, RequiredStates } from './booleanStateValidation';
import { FigmaComponentSet } from '../types/figma';

describe('validateBooleanState', () => {
    describe('Button component', () => {
        it('should return error when missing disabled state', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    { id: '1:2', name: 'State=Default', properties: { State: 'Default' } },
                    { id: '1:3', name: 'State=Hover', properties: { State: 'Hover' } },
                ],
            };

            const findings = validateBooleanState(componentSet);

            expect(findings).toContainEqual(
                expect.objectContaining({
                    type: 'Error',
                    message: 'Missing required state: disabled',
                })
            );
        });

        it('should return error when missing loading state', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    { id: '1:2', name: 'Disabled=True', properties: { Disabled: 'True' } },
                ],
            };

            const findings = validateBooleanState(componentSet);

            expect(findings).toContainEqual(
                expect.objectContaining({
                    type: 'Error',
                    message: 'Missing required state: loading',
                })
            );
        });

        it('should pass when all required states are present', () => {
            const componentSet: FigmaComponentSet = {
                id: '1:1',
                name: 'Button',
                type: 'COMPONENT_SET',
                componentType: 'Button',
                variants: [
                    { id: '1:2', name: 'Disabled=True', properties: { Disabled: 'True' } },
                    { id: '1:3', name: 'Loading=True', properties: { Loading: 'True' } },
                ],
            };

            const findings = validateBooleanState(componentSet);

            expect(findings).toEqual([]);
        });
    });

    describe('Input component', () => {
        it('should return error when missing error state', () => {
            const componentSet: FigmaComponentSet = {
                id: '2:1',
                name: 'Input',
                type: 'COMPONENT_SET',
                componentType: 'Input',
                variants: [
                    { id: '2:2', name: 'Disabled=True', properties: { Disabled: 'True' } },
                ],
            };

            const findings = validateBooleanState(componentSet);

            expect(findings).toContainEqual(
                expect.objectContaining({
                    type: 'Error',
                    message: 'Missing required state: error',
                })
            );
        });
    });

    describe('Unknown component type', () => {
        it('should return empty array for unknown component types', () => {
            const componentSet: FigmaComponentSet = {
                id: '3:1',
                name: 'CustomWidget',
                type: 'COMPONENT_SET',
                componentType: 'Unknown',
                variants: [],
            };

            const findings = validateBooleanState(componentSet);

            expect(findings).toEqual([]);
        });
    });
});

describe('RequiredStates', () => {
    it('should define required states for Button', () => {
        expect(RequiredStates.Button).toContain('disabled');
        expect(RequiredStates.Button).toContain('loading');
    });

    it('should define required states for Input', () => {
        expect(RequiredStates.Input).toContain('disabled');
        expect(RequiredStates.Input).toContain('error');
    });
});
