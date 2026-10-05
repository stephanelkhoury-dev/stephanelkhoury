'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

export default function PremiumFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-300 dark:border-zinc-900 py-10 md:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="text-base font-bold tracking-[0.08em] text-zinc-900 dark:text-zinc-100 flex items-center justify-center md:justify-start mb-2">
              STEPHAN EL KHOURY
            </Link>
            <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} Stephan El Khoury. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="/#about" className="px-1 py-1.5 transition-colors hover:text-[var(--accent-primary)]">About</Link>
            <Link href="/#projects" className="px-1 py-1.5 transition-colors hover:text-[var(--accent-primary)]">Selected work</Link>
            <Link href="/#experience" className="px-1 py-1.5 transition-colors hover:text-[var(--accent-primary)]">Experience</Link>
            <Link href="/#contact" className="px-1 py-1.5 transition-colors hover:text-[var(--accent-primary)]">Contact</Link>
          </div>

          <button onClick={scrollToTop} className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--surface)] text-[var(--muted)] transition-all hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white" aria-label="Scroll to top">
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
