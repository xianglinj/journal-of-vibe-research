'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-emerald-400">JVR</span>
              <span className="text-sm text-slate-300 hidden sm:block">Journal of Vibe Research</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
            <Link href="/browse" className="text-slate-300 hover:text-white transition-colors">Browse</Link>
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-slate-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-slate-800 px-4 pb-4 space-y-2">
          <Link href="/" className="block py-2 text-slate-300 hover:text-white" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/browse" className="block py-2 text-slate-300 hover:text-white" onClick={() => setMobileOpen(false)}>Browse</Link>
          <Link href="/about" className="block py-2 text-slate-300 hover:text-white" onClick={() => setMobileOpen(false)}>About</Link>
        </div>
      )}
    </nav>
  );
}
