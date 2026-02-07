import type { SelectionInfo, SandboxToUIMessage } from '../shared/messages';

/**
 * Figma Plugin Sandbox (Main Thread)
 * Has access to the figma API
 */

// Show the UI
figma.showUI(__html__, {
    width: 320,
    height: 480,
    themeColors: true,
});

/**
 * Helper to check if a property is bound to a variable
 */
function getBoundVariables(node: BaseNode): Record<string, string> {
    const bound: Record<string, string> = {};
    const anyNode = node as any;

    if (anyNode.boundVariables) {
        for (const [prop, variable] of Object.entries(anyNode.boundVariables)) {
            if (variable && (variable as any).id) {
                bound[prop] = (variable as any).id;
            }
        }
    }

    return bound;
}

/**
 * Extract component info for a specific node
 */
function extractNodeInfo(node: SceneNode): SelectionInfo {
    const info: SelectionInfo = {
        id: node.id,
        name: node.name,
        type: node.type,
        boundVariables: getBoundVariables(node),
    };

    // Layout
    if ('paddingLeft' in node) info.paddingLeft = node.paddingLeft;
    if ('paddingRight' in node) info.paddingRight = node.paddingRight;
    if ('paddingTop' in node) info.paddingTop = node.paddingTop;
    if ('paddingBottom' in node) info.paddingBottom = node.paddingBottom;
    if ('itemSpacing' in node) info.itemSpacing = node.itemSpacing;

    // Geometry
    if ('cornerRadius' in node) {
        info.cornerRadius = node.cornerRadius === figma.mixed ? 'mixed' : node.cornerRadius;
    }

    // Children (if component set or group/frame)
    if ('children' in node && node.type === 'COMPONENT_SET') {
        info.children = node.children.map(child => extractNodeInfo(child as SceneNode));
    }

    return info;
}

/**
 * Get component type from node name
 */
function getComponentType(name: string): 'Button' | 'Input' | 'Card' | 'Unknown' {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('button')) return 'Button';
    if (lowerName.includes('input') || lowerName.includes('textfield')) return 'Input';
    if (lowerName.includes('card')) return 'Card';
    return 'Unknown';
}

/**
 * Extract selection info from current selection
 */
function getSelectionInfo(): SelectionInfo | null {
    const selection = figma.currentPage.selection;

    if (selection.length === 0) return null;

    const node = selection[0];
    const info = extractNodeInfo(node);
    info.componentType = getComponentType(node.name);

    return info;
}

/**
 * Post message to UI
 */
function postToUI(message: SandboxToUIMessage) {
    figma.ui.postMessage(message);
}

/**
 * Send current selection to UI
 */
function notifySelectionChanged() {
    const selection = getSelectionInfo();
    postToUI({
        type: 'SELECTION_CHANGED',
        selection,
    });
}

// Listen for selection changes
figma.on('selectionchange', () => {
    notifySelectionChanged();
});

// Send initial selection state
notifySelectionChanged();

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
    if (msg.type === 'AUDIT_REQUEST') {
        const selection = getSelectionInfo();
        if (selection) {
            postToUI({
                type: 'DATA_READY',
                selection,
            });
        } else {
            postToUI({
                type: 'ERROR',
                message: 'No component selected',
            });
        }
    }

    if (msg.type === 'SCAFFOLD_REQUEST') {
        const fixes = msg.fixes as string[];
        const selection = figma.currentPage.selection;

        if (selection.length === 0) {
            postToUI({
                type: 'ERROR',
                message: 'No component selected for scaffolding',
            });
            return;
        }

        const targetNode = selection[0];

        try {
            // Create "Code Only Props" frame structure (Nathan Curtis pattern)
            await generateCodeOnlyPropsFrame(targetNode, fixes);

            postToUI({
                type: 'SCAFFOLD_COMPLETE',
                success: true,
            });
        } catch (error: any) {
            postToUI({
                type: 'ERROR',
                message: `Scaffold failed: ${error.message}`,
            });
        }
    }
};

/**
 * Generate the "Code Only Props" frame for a component
 * Following Nathan Curtis pattern: hidden frame with text layers for each prop
 */
async function generateCodeOnlyPropsFrame(node: SceneNode, props: string[]): Promise<void> {
    // Find or get the parent container (component or component set)
    let targetParent: SceneNode = node;

    // If it's a component variant, add to the specific variant
    // If it's a component set, add to the first variant
    if (node.type === 'COMPONENT_SET' && 'children' in node) {
        targetParent = node.children[0] as SceneNode;
    }

    // Check if parent supports children
    if (!('appendChild' in targetParent)) {
        throw new Error('Selected node cannot contain children');
    }

    // Check if "Code only props" frame already exists
    let codeOnlyFrame: FrameNode | null = null;
    if ('children' in targetParent) {
        for (const child of (targetParent as any).children) {
            if (child.name === 'Code only props' && child.type === 'FRAME') {
                codeOnlyFrame = child as FrameNode;
                break;
            }
        }
    }

    // Create frame if it doesn't exist
    if (!codeOnlyFrame) {
        codeOnlyFrame = figma.createFrame();
        codeOnlyFrame.name = 'Code only props';

        // Style the frame (hidden/collapsed appearance)
        codeOnlyFrame.resize(200, 10);
        codeOnlyFrame.fills = []; // No fill (transparent)
        codeOnlyFrame.strokes = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
        codeOnlyFrame.strokeWeight = 1;
        codeOnlyFrame.dashPattern = [4, 4]; // Dashed border
        codeOnlyFrame.cornerRadius = 4;
        codeOnlyFrame.layoutMode = 'VERTICAL';
        codeOnlyFrame.primaryAxisSizingMode = 'AUTO';
        codeOnlyFrame.counterAxisSizingMode = 'AUTO';
        codeOnlyFrame.paddingTop = 8;
        codeOnlyFrame.paddingBottom = 8;
        codeOnlyFrame.paddingLeft = 8;
        codeOnlyFrame.paddingRight = 8;
        codeOnlyFrame.itemSpacing = 4;

        // Position outside visible area (below the component)
        if ('height' in node) {
            codeOnlyFrame.x = 0;
            codeOnlyFrame.y = (node as any).height + 20;
        }

        // Add to parent
        (targetParent as any).appendChild(codeOnlyFrame);
    }

    // Load font for text layers
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

    // Add text layer for each missing prop
    for (const propName of props) {
        // Check if prop already exists
        let propExists = false;
        for (const child of codeOnlyFrame.children) {
            if (child.type === 'TEXT' && child.name.startsWith(propName)) {
                propExists = true;
                break;
            }
        }

        if (!propExists) {
            const textNode = figma.createText();
            textNode.name = propName;
            textNode.characters = `${propName}: [value]`;
            textNode.fontSize = 10;
            textNode.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];

            codeOnlyFrame.appendChild(textNode);
        }
    }

    // Lock the frame to prevent accidental edits
    codeOnlyFrame.locked = true;

    // Collapse the frame in the layer panel (set visible but small)
    codeOnlyFrame.visible = true;
    codeOnlyFrame.opacity = 0.5;
}
