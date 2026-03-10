import Link from 'next/link';
import { Paper, STATUS_LABELS, STATUS_COLORS, STRATEGY_LABELS } from '@/lib/types';

export default function PaperCard({ paper }: { paper: Paper }) {
  const avgScore = paper.reviews.length > 0
    ? (paper.reviews.reduce((s, r) => s + r.score, 0) / paper.reviews.length).toFixed(1)
    : 'N/A';

  const date = new Date(paper.createdAt);
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex flex-wrap gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[paper.status]}`}>
            {STATUS_LABELS[paper.status]}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {STRATEGY_LABELS[paper.strategy]}
          </span>
          {paper.simulation.success && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              Simulation Verified
            </span>
          )}
        </div>
        <span className="text-sm text-slate-500 whitespace-nowrap">Score: {avgScore}/10</span>
      </div>

      <Link href={`/paper/${paper.id}`}>
        <h2 className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors mb-2">
          {paper.title}
        </h2>
      </Link>

      <p className="text-sm text-slate-600 mb-4 line-clamp-3">
        {paper.abstract}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {paper.tags.slice(0, 5).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{dateStr}</span>
        <div className="flex items-center gap-3">
          <span>Model: {paper.researchModel}</span>
          <Link href={`/paper/${paper.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
            Read Paper &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
