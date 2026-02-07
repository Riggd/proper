import { NextRequest, NextResponse } from 'next/server';
import { validate, VERSION } from '@proper/core';
import { transformFigmaNode, RawFigmaNode } from '@/lib/transform';

// Auth configuration - MUST be set in production
const SHARED_SECRET = process.env.PROPPER_SHARED_SECRET;
const IS_DEV = process.env.NODE_ENV === 'development';

// Score calculation constants
const WARNING_WEIGHT = 0.5;
const POINTS_PER_ISSUE = 15;

/**
 * CORS headers for Figma plugin (runs in sandboxed iframe with origin 'null')
 * Note: Figma plugins have 'null' origin, so we must use '*' but authenticate via header
 */
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-propper-key',
};

/**
 * OPTIONS /api/audit
 * 
 * Handle CORS preflight requests.
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

/**
 * Request body schema
 */
interface AuditRequestBody {
    component: RawFigmaNode;
}

/**
 * POST /api/audit
 * 
 * Validates a Figma component using the core rules engine.
 * Requires x-propper-key header for authentication.
 */
export async function POST(request: NextRequest) {
    // Validate authentication
    const apiKey = request.headers.get('x-propper-key');
    const expectedKey = SHARED_SECRET || (IS_DEV ? 'dev-secret' : undefined);

    if (!expectedKey) {
        console.error('PROPPER_SHARED_SECRET must be set in production');
        return NextResponse.json(
            { error: 'Server Error', message: 'API not configured' },
            { status: 500, headers: corsHeaders }
        );
    }

    if (!apiKey || apiKey !== expectedKey) {
        return NextResponse.json(
            { error: 'Unauthorized', message: 'Invalid or missing x-propper-key' },
            { status: 401, headers: corsHeaders }
        );
    }

    // Parse request body
    let body: AuditRequestBody;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Bad Request', message: 'Invalid JSON body' },
            { status: 400, headers: corsHeaders }
        );
    }

    // Validate required fields
    if (!body.component || !body.component.id || !body.component.name) {
        return NextResponse.json(
            { error: 'Bad Request', message: 'Missing required component data' },
            { status: 400, headers: corsHeaders }
        );
    }

    // Transform Figma node to our format
    const componentSet = transformFigmaNode(body.component);

    // Run validation
    const result = validate(componentSet);

    // Calculate score (0-100)
    const errorCount = result.findings.filter(f => f.severity === 'error').length;
    const warningCount = result.findings.filter(f => f.severity === 'warning').length;
    const totalIssues = errorCount + (warningCount * WARNING_WEIGHT);
    const score = Math.max(0, Math.round(100 - (totalIssues * POINTS_PER_ISSUE)));

    return NextResponse.json({
        success: true,
        score,
        passed: result.passed,
        findings: result.findings,
        component: {
            id: componentSet.id,
            name: componentSet.name,
            type: componentSet.componentType,
        },
        meta: {
            validatedAt: result.validatedAt,
            rulesVersion: VERSION,
        },
    }, { headers: corsHeaders });
}

/**
 * GET /api/audit
 * 
 * Returns API info and health check.
 */
export async function GET() {
    return NextResponse.json({
        service: 'Propper Audit API',
        version: VERSION,
        status: 'healthy',
        endpoints: {
            'POST /api/audit': 'Validate a Figma component',
        },
    }, { headers: corsHeaders });
}

