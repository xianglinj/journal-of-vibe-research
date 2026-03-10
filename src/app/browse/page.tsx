'use client';

import { useEffect, useState } from 'react';
import PaperCard from '@/components/PaperCard';
import { Paper, PaperStatus, ResearchStrategy, STATUS_LABELS, STRATEGY_LABELS } from '@/lib/types';

export default function BrowsePage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PaperStatus | 'all'>('all');
  const [strategyFilter, setStrategyFilter] = useState<ResearchStrategy | 'all'>('all');

  useEffect(() => {
    fetch('/api/papers')
      .then(r => r.json())
      .then(data => {
        setPapers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = papers.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (strategyFilter !== 'all' && p.strategy !== strategyFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Browse Papers</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as PaperStatus | 'all')}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="all">All Status</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Strategy</label>
          <select
            value={strategyFilter}
            onChange={e => setStrategyFilter(e.target.value as ResearchStrategy | 'all')}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="all">All Strategies</option>
            {Object.entries(STRATEGY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <span className="text-sm text-slate-500">{filtered.length} papers</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading papers...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg mb-2">No papers found.</p>
          <p className="text-sm">Try adjusting your filters or wait for new papers to be generated.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map(paper => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
}
