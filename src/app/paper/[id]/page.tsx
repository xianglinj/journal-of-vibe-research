import { getPaper, getAllPapers } from '@/lib/papers';
import { STATUS_LABELS, STATUS_COLORS, STRATEGY_LABELS } from '@/lib/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import katex from 'katex';

export const dynamic = 'force-dynamic';

export default async function PaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = getPaper(id);

  if (!paper) {
    notFound();
  }

  const date = new Date(paper.createdAt);
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const avgScore = paper.reviews.length > 0
    ? (paper.reviews.reduce((s, r) => s + r.score, 0) / paper.reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link href="/browse" className="text-blue-600 hover:text-blue-800 text-sm mb-6 inline-block">
        &larr; Back to Browse
      </Link>

      {/* Paper header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[paper.status]}`}>
            {STATUS_LABELS[paper.status]}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            {STRATEGY_LABELS[paper.strategy]}
          </span>
          {paper.simulation.success && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
              Simulation Verified
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">{paper.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
          <span>ID: {paper.id}</span>
          <span>Published: {dateStr}</span>
          <span>Model: {paper.researchModel}</span>
          <span>Avg Score: {avgScore}/10</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {paper.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>

        {/* Abstract */}
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-2">Abstract</h2>
          <p className="text-slate-700 leading-relaxed">{paper.abstract}</p>
        </div>
      </header>

      {/* Paper content */}
      <section className="mb-12">
        <div className="paper-content" dangerouslySetInnerHTML={{ __html: markdownToHtml(paper.content) }} />
      </section>

      {/* Simulation code */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Simulation Code</h2>
        <div className={`rounded-lg border ${paper.simulation.success ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'} p-4 mb-4`}>
          <span className={`text-sm font-medium ${paper.simulation.success ? 'text-emerald-700' : 'text-red-700'}`}>
            {paper.simulation.success ? 'Simulation completed successfully' : 'Simulation encountered errors'}
          </span>
        </div>
        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
          <code>{paper.simulation.code}</code>
        </pre>
        {paper.simulation.output && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Output</h3>
            <pre className="bg-slate-100 rounded-lg p-4 overflow-x-auto text-sm text-slate-700 max-h-96 overflow-y-auto">
              {paper.simulation.output}
            </pre>
          </div>
        )}
      </section>

      {/* Peer Reviews */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Peer Reviews</h2>
        <div className="space-y-6">
          {paper.reviews.map((review, i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{review.reviewer}</h3>
                  <p className="text-sm text-slate-500">{review.expertise}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{review.score}/10</div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    review.decision === 'accept' ? 'bg-green-100 text-green-800' :
                    review.decision === 'minor_revision' ? 'bg-yellow-100 text-yellow-800' :
                    review.decision === 'major_revision' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {review.decision.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <p className="text-slate-700 mb-4">{review.summary}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-emerald-700 mb-2">Strengths</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {review.strengths.map((s, j) => (
                      <li key={j} className="flex items-start gap-1">
                        <span className="text-emerald-500 mt-0.5">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-700 mb-2">Weaknesses</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {review.weaknesses.map((w, j) => (
                      <li key={j} className="flex items-start gap-1">
                        <span className="text-red-500 mt-0.5">-</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {review.questions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-blue-700 mb-2">Questions for Authors</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {review.questions.map((q, j) => (
                      <li key={j} className="flex items-start gap-1">
                        <span className="text-blue-500 mt-0.5">?</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function renderKatex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: false,
    });
  } catch {
    // Fallback: show raw LaTeX in a styled span
    const cls = displayMode
      ? 'my-4 text-center font-mono text-sm bg-slate-50 py-3 px-4 rounded overflow-x-auto'
      : 'font-mono text-sm bg-slate-50 px-1 rounded';
    const tag = displayMode ? 'div' : 'span';
    const safeTex = tex.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<${tag} class="${cls}">${safeTex}</${tag}>`;
  }
}

function processLatex(html: string): string {
  // Split by <pre>...</pre> to protect code blocks
  const parts = html.split(/(<pre>[\s\S]*?<\/pre>)/g);
  return parts.map(part => {
    if (part.startsWith('<pre>')) return part;

    let processed = part;

    // Display math: \[...\] or $$...$$
    processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_m, tex) => renderKatex(tex.trim(), true));
    processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_m, tex) => renderKatex(tex.trim(), true));

    // Inline math: \(...\) or $...$
    // Use [\s\S]*? for inner content since LaTeX can contain any character
    processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_m, tex) => renderKatex(tex.trim(), false));
    processed = processed.replace(/\$([^\n$]+?)\$/g, (_m, tex) => renderKatex(tex.trim(), false));

    return processed;
  }).join('');
}

// Allowed HTML tags in rendered output
const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
  'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li',
  'div', 'span', 'sup', 'sub', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  // KaTeX tags
  'math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msub', 'msup', 'mfrac',
  'mover', 'munder', 'msqrt', 'mspace', 'mtext', 'annotation',
]);

function sanitizeHtml(html: string): string {
  // Remove script/style/iframe/object/embed tags and their content
  let sanitized = html.replace(/<(script|style|iframe|object|embed|form|input|textarea|button|select|link|meta)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  sanitized = sanitized.replace(/<(script|style|iframe|object|embed|form|input|textarea|button|select|link|meta)\b[^>]*\/?>/gi, '');

  // Remove event handlers (onclick, onerror, onload, etc.)
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Remove javascript: and data: URLs in attributes
  sanitized = sanitized.replace(/(?:href|src|action)\s*=\s*(?:"(?:javascript|data):[^"]*"|'(?:javascript|data):[^']*')/gi, '');

  return sanitized;
}

function markdownToHtml(md: string): string {
  // Strip outer markdown/latex fence if the LLM wrapped the whole paper in one
  let html = md.replace(/^```(?:markdown|latex|tex)?\s*\n([\s\S]*?)\n```\s*$/g, '$1').trim();

  // Code blocks (must be first to protect content inside from other transforms)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, _lang, code) => {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre><code>${escaped}</code></pre>`;
  });

  // Process all LaTeX math notations
  html = processLatex(html);

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code (after math so we don't clobber katex output)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Paragraphs (lines not already wrapped in tags)
  html = html.replace(/^(?!<[hupold]|$)(.+)$/gm, '<p>$1</p>');

  // Clean up extra newlines
  html = html.replace(/\n{3,}/g, '\n\n');

  // Sanitize to remove dangerous HTML
  html = sanitizeHtml(html);

  return html;
}
