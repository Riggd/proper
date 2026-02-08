/**
 * Message types for Plugin UI <-> Sandbox communication
 */

export type MessageType =
    | 'SELECTION_CHANGED'
    | 'AUDIT_REQUEST'
    | 'AUDIT_RESULT'
    | 'SCAFFOLD_REQUEST'
    | 'SCAFFOLD_COMPLETE'
    | 'CREATE_PROPS_REQUEST'
    | 'CREATE_PROPS_COMPLETE'
    | 'DATA_READY'
    | 'ERROR';

export interface SelectionInfo {
    id: string;
    name: string;
    type: string;
    componentType?: 'Button' | 'Input' | 'Card' | 'Unknown';
    children?: SelectionInfo[];

    // Layout
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    itemSpacing?: number;

    // Geometry
    cornerRadius?: number | 'mixed';

    // Tokens/Variables
    // Map of property -> variableId or variable name
    boundVariables?: Record<string, string>;
}

export interface AuditFinding {
    severity: 'error' | 'warning' | 'info';
    message: string;
    rule?: string;
    suggestedFix?: string;
    /** Educational explanation of WHY this matters for engineering */
    reason?: string;
}

export interface AuditResult {
    passed: boolean;
    score: number;
    findings: AuditFinding[];
}

// Messages FROM Sandbox TO UI
export interface SelectionChangedMessage {
    type: 'SELECTION_CHANGED';
    selection: SelectionInfo | null;
}

export interface AuditResultMessage {
    type: 'AUDIT_RESULT';
    result: AuditResult;
}

export interface ScaffoldCompleteMessage {
    type: 'SCAFFOLD_COMPLETE';
    success: boolean;
}

export interface CreatePropsCompleteMessage {
    type: 'CREATE_PROPS_COMPLETE';
    success: boolean;
    count: number;
}

export interface DataReadyMessage {
    type: 'DATA_READY';
    selection: SelectionInfo;
}

export interface ErrorMessage {
    type: 'ERROR';
    message: string;
}

// Messages FROM UI TO Sandbox
export interface AuditRequestMessage {
    type: 'AUDIT_REQUEST';
}

export interface ScaffoldRequestMessage {
    type: 'SCAFFOLD_REQUEST';
    fixes: string[];
}

export interface CreatePropsRequestMessage {
    type: 'CREATE_PROPS_REQUEST';
}

// Union types for type safety
export type SandboxToUIMessage =
    | SelectionChangedMessage
    | AuditResultMessage
    | DataReadyMessage
    | ScaffoldCompleteMessage
    | CreatePropsCompleteMessage
    | ErrorMessage;

export type UIToSandboxMessage =
    | AuditRequestMessage
    | ScaffoldRequestMessage
    | CreatePropsRequestMessage;

export type PluginMessage = SandboxToUIMessage | UIToSandboxMessage;
