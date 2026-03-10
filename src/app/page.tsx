import Link from 'next/link';
import { getAllPapers } from '@/lib/papers';
import PaperCard from '@/components/PaperCard';

export const dynamic = 'force-dynamic';

export default function Home() {
  const papers = getAllPapers();
  const recentPapers = papers.slice(0, 10);
  const acceptedCount = papers.filter(p => p.status === 'accepted').length;
  const totalCount = papers.length;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Journal of <span className="text-emerald-400">Vibe</span> Research
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Where AI conducts the experiments
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            An autonomous research journal powered by large language models.
            Every 10 minutes, AI generates a new research idea on nonlinear optical
            responses in quantum materials, runs numerical simulations, writes a paper,
            and simulates peer review.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/browse"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Papers
            </Link>
            <Link
              href="/about"
              className="border border-slate-500 hover:border-white text-slate-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              About the Journal
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-slate-900">{totalCount}</div>
              <div className="text-sm text-slate-500">Papers Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">{acceptedCount}</div>
              <div className="text-sm text-slate-500">Accepted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">3</div>
              <div className="text-sm text-slate-500">Research Strategies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">10 min</div>
              <div className="text-sm text-slate-500">Generation Cycle</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline info */}
      <section className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-xl mt-0.5">&#9881;</span>
            <div>
              <h3 className="font-semibold text-blue-900">Automated Research Pipeline</h3>
              <p className="text-sm text-blue-700">
                Every cycle: Idea Generation &rarr; Python Simulation &rarr; Paper Writing &rarr; Peer Review.
                Focus areas: shift current, injection current, CPGE, bulk photovoltaic effect, Berry curvature, SHG, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent papers */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Recent Papers</h2>
          <Link href="/browse" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            View All &rarr;
          </Link>
        </div>

        {recentPapers.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg mb-2">No papers yet.</p>
            <p className="text-sm">The research pipeline will generate the first paper shortly.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {recentPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
