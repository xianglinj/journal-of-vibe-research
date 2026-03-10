import fs from 'fs';
import path from 'path';
import { Paper } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'papers');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getAllPapers(): Paper[] {
  ensureDir();
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  const papers: Paper[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
      papers.push(JSON.parse(raw));
    } catch {
      // skip malformed files
    }
  }
  return papers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPaper(id: string): Paper | null {
  // Validate paper ID format to prevent path traversal
  if (!/^vr-\d{4}-\d{3,}$/.test(id)) return null;

  ensureDir();
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export function savePaper(paper: Paper): void {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${paper.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(paper, null, 2));
}

export function getNextPaperId(): string {
  const papers = getAllPapers();
  const num = papers.length + 1;
  return `vr-2026-${String(num).padStart(3, '0')}`;
}

export function getPaperCount(): number {
  ensureDir();
  return fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')).length;
}
