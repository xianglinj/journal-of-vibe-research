import { NextRequest, NextResponse } from 'next/server';
import { runFullPipeline } from '@/lib/pipeline';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 900; // 15 minutes max for gpt-5.4-pro reasoning pipeline

let isRunning = false;
let lastGenerationTime = 0;
const MIN_INTERVAL_MS = 60000; // Minimum 1 minute between generations

function isAuthorized(request: NextRequest): boolean {
  // Allow internal scheduler (no request headers check needed for server-side calls)
  const authHeader = request.headers.get('authorization');
  const apiSecret = process.env.API_SECRET;

  // If API_SECRET is set, require it for external requests
  if (apiSecret) {
    return authHeader === `Bearer ${apiSecret}`;
  }

  // If no API_SECRET configured, only allow from localhost
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || '127.0.0.1';
  return ip === '127.0.0.1' || ip === '::1' || ip === 'localhost';
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isRunning) {
    return NextResponse.json(
      { error: 'A generation is already in progress' },
      { status: 409 }
    );
  }

  // Rate limiting
  const now = Date.now();
  if (now - lastGenerationTime < MIN_INTERVAL_MS) {
    return NextResponse.json(
      { error: 'Rate limited. Please wait before triggering another generation.' },
      { status: 429 }
    );
  }

  isRunning = true;
  lastGenerationTime = now;
  try {
    const paper = await runFullPipeline();
    return NextResponse.json({
      success: true,
      paper: {
        id: paper.id,
        title: paper.title,
        status: paper.status,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Generate] Pipeline error:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  } finally {
    isRunning = false;
  }
}

export async function GET() {
  return NextResponse.json({
    status: isRunning ? 'running' : 'idle',
  });
}
