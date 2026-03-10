import { NextResponse } from 'next/server';
import { getAllPapers } from '@/lib/papers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const papers = getAllPapers();
  return NextResponse.json(papers);
}
