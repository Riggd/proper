import React, { useState, useEffect } from 'react';
import type { SelectionInfo, SandboxToUIMessage, AuditResult } from '../shared/messages';
import './App.css';

// Configuration - use environment variables with dev fallbacks
const API_URL = import.meta.env.VITE_PROPPER_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_PROPPER_API_KEY || 'dev-secret';

type PluginState = 'idle' | 'selected' | 'auditing' | 'results' | 'scaffolding';

export const App: React.FC = () => {
    const [state, setState] = useState<PluginState>('idle');
    const [selection, setSelection] = useState<SelectionInfo | null>(null);
    const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Listen for messages from the sandbox
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            try {
                const msg = event.data.pluginMessage as SandboxToUIMessage;
                if (!msg) return;

                switch (msg.type) {
                    case 'SELECTION_CHANGED':
                        setSelection(msg.selection);
                        if (msg.selection) {
                            setState('selected');
                            setError(null);
                        } else {
                            setState('idle');
                        }
                        setAuditResult(null);
                        break;

                    case 'AUDIT_RESULT':
                        setAuditResult(msg.result);
                        setState('results');
                        break;

                    case 'DATA_READY':
                        performRemoteAudit(msg.selection);
                        break;

                    case 'SCAFFOLD_COMPLETE':
                        if (msg.success) {
                            setError(null);
                            // Re-audit after scaffolding
                            setState('auditing');
                            postToSandbox({ type: 'AUDIT_REQUEST' });
                        } else {
                            setError('Scaffold generation failed');
                            setState('results');
                        }
                        break;



                    case 'ERROR':
                        setError(msg.message);
                        setState('selected');
                        break;
                }
            } catch (e) {
                console.error('Plugin message handling error:', e);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const performRemoteAudit = async (data: SelectionInfo) => {
        try {
            const response = await fetch(`${API_URL}/api/audit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-propper-key': API_KEY,
                },
                body: JSON.stringify({ component: data }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Audit failed');
            }

            const result = await response.json();
            setAuditResult(result);
            setState('results');
        } catch (err: any) {
            setError(`Audit error: ${err.message}`);
            setState('selected');
        }
    };

    // Send message to sandbox
    const postToSandbox = (msg: any) => {
        parent.postMessage({ pluginMessage: msg }, '*');
    };

    const handleAudit = () => {
        setState('auditing');
        postToSandbox({ type: 'AUDIT_REQUEST' });
    };

    const handleScaffold = () => {
        if (!auditResult) return;

        // Extract fixable issues (errors related to missing props)
        const fixes = auditResult.findings
            .filter(f => f.severity === 'error' && f.suggestedFix)
            .map(f => f.suggestedFix as string);

        setState('scaffolding');
        postToSandbox({ type: 'SCAFFOLD_REQUEST', fixes });
    };



    // Check if there are fixable issues
    const hasFixableIssues = auditResult?.findings.some(
        f => f.severity === 'error' && f.suggestedFix
    );

    return (
        <div className="plugin-container">
            <header className="plugin-header">
                <h1>Propper</h1>
                <span className="version">v1.0.0</span>
            </header>

            <main className="plugin-main">
                {state === 'idle' && (
                    <div className="state-idle">
                        <div className="empty-state">
                            <div className="empty-icon">🎯</div>
                            <h2>Select a Component</h2>
                            <p>Select a Button, Input, or Card component to audit.</p>
                        </div>
                    </div>
                )}

                {state === 'selected' && selection && (
                    <div className="state-selected">
                        <div className="selection-info">
                            <div className="component-badge">
                                {selection.componentType}
                            </div>
                            <h2>{selection.name}</h2>
                            <p className="node-type">{selection.type}</p>
                        </div>
                        <button
                            className="audit-button"
                            onClick={handleAudit}
                        >
                            Audit Component
                        </button>
                    </div>
                )}

                {(state === 'auditing' || state === 'scaffolding') && (
                    <div className="state-auditing">
                        <div className="spinner"></div>
                        <p>{state === 'scaffolding' ? 'Processing...' : 'Auditing...'}</p>
                    </div>
                )}

                {state === 'results' && auditResult && (
                    <div className="state-results">
                        <div className={`score ${auditResult.passed ? 'passed' : 'failed'}`}>
                            <span className="score-icon">
                                {auditResult.passed ? '✓' : '✗'}
                            </span>
                            <span className="score-label">
                                {auditResult.passed ? 'PASSED' : 'FAILED'}
                            </span>
                        </div>

                        {auditResult.findings.length > 0 && (
                            <div className="findings">
                                {auditResult.findings.map((finding, i) => (
                                    <div key={i} className={`finding ${finding.severity}`}>
                                        <span className="finding-severity">
                                            {finding.severity.toUpperCase()}
                                        </span>
                                        <span className="finding-message">
                                            {finding.message}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {hasFixableIssues && (
                            <button
                                className="scaffold-button"
                                onClick={handleScaffold}
                            >
                                🔧 Auto-Scaffold Missing Props
                            </button>
                        )}



                        <button
                            className="reaudit-button"
                            onClick={handleAudit}
                        >
                            Re-Audit
                        </button>
                    </div>
                )}

                {error && (
                    <div className="error-toast">
                        {error}
                    </div>
                )}
            </main>
        </div>
    );
};
