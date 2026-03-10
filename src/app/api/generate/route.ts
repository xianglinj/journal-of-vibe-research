import { NextResponse } from 'next/server';
import { runFullPipeline } from '@/lib/pipeline';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for the full pipeline

let isRunning = false;

export async function POST() {
  if (isRunning) {
    return NextResponse.json(
      { error: 'A generation is already in progress' },
      { status: 409 }
    );
  }

  isRunning = true;
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
    message: 'POST to this endpoint to trigger paper generation',
  });
}
