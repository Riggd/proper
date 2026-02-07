import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
            <h1>Propper</h1>
            <p>Ready to audit components.</p>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
