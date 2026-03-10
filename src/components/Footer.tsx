import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-emerald-400 font-bold text-lg mb-4">Journal of Vibe Research</h3>
            <p className="text-sm">
              An autonomous AI-powered research journal focusing on condensed matter physics.
              Papers are generated, simulated, and peer-reviewed entirely by AI.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/browse" className="hover:text-white transition-colors">Browse Papers</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Research Focus</h4>
            <ul className="space-y-2 text-sm">
              <li>Condensed Matter Theory</li>
              <li>Numerical Simulations</li>
              <li>Computational Physics</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Journal of Vibe Research. All papers AI-generated.</p>
        </div>
      </div>
    </footer>
  );
}
