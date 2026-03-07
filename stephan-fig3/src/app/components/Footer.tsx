import React from 'react';
import { ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-left">
            <a href="#" className="text-xl font-bold tracking-tighter text-zinc-100 flex items-center gap-1 justify-center md:justify-start mb-2">
              STEPHAN<span className="text-blue-500">.</span>EK
            </a>
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} Stephan El Khoury. All rights reserved.
            </p>
          </div>

          <div className="flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a>
            <a href="#music" className="hover:text-blue-400 transition-colors">Music</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>

          <button 
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
