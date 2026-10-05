'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { useTheme } from 'next-themes';

const emptySubscribe = () => () => {};

const navLinks = [
  { name: 'Work', href: '/#projects' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
];

const THEMES = [
  { value: 'dark',   Icon: Moon,    label: 'Dark'  },
  { value: 'light',  Icon: Sun,     label: 'Light' },
] as const;

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!mounted) return <div className="h-11 w-11" />;

  const idx = THEMES.findIndex((t) => t.value === theme);
  const current = THEMES[idx >= 0 ? idx : 0];
  const next    = THEMES[(idx + 1) % THEMES.length];
  const { Icon } = current;

  return (
    <div className="relative">
      <button
        onClick={() => setTheme(next.value)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={`Switch to ${next.label} mode`}
        className="flex h-11 w-11 items-center justify-center rounded-md bg-transparent text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--foreground)]/5 hover:text-[var(--accent-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
      >
        <Icon size={19} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            key="tt"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 whitespace-nowrap z-50 pointer-events-none"
          >
            {next.label} mode
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-100 dark:bg-zinc-800 border-l border-t border-zinc-300 dark:border-zinc-700 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PremiumNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const menuTrigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const backgroundRoot = navRef.current?.closest('header')?.parentElement ?? navRef.current?.parentElement;
    const backgroundNodes = Array.from(backgroundRoot?.children ?? [])
      .filter((node): node is HTMLElement => (
        node instanceof HTMLElement &&
        !node.contains(navRef.current) &&
        !node.contains(menuRef.current)
      ));
    const previousInert = backgroundNodes.map((node) => node.inert);
    backgroundNodes.forEach((node) => { node.inert = true; });
    document.body.style.overflow = 'hidden';

    const focusMenu = requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>('a[href], button:not(:disabled)')?.focus();
    });

    const handleMenuKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)') ?? []);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleMenuKeys);
    return () => {
      cancelAnimationFrame(focusMenu);
      window.removeEventListener('keydown', handleMenuKeys);
      backgroundNodes.forEach((node, index) => { node.inert = previousInert[index]; });
      document.body.style.overflow = previousOverflow;
      menuTrigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <header>
      <nav ref={navRef} className={`portfolio-nav fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled ? 'border-[var(--card-border)] bg-[var(--background)]/95 py-3 shadow-sm backdrop-blur-md' : 'border-transparent bg-[var(--background)]/88 py-3 backdrop-blur-sm md:py-4'}`}>
      <Link href="#main-content" className="skip-link">Skip to main content</Link>
      <div className="mx-auto flex max-w-[1760px] items-center justify-between px-5 sm:px-8 md:px-12">
        <Link href="/" className="shrink-0 text-sm font-semibold text-[var(--foreground)] sm:text-base">
          STEPHAN EL KHOURY
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="nav-link-underline relative whitespace-nowrap text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
              {link.name}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            ref={triggerRef}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="portfolio-mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-md bg-transparent text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--foreground)]/5 hover:text-[var(--accent-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && createPortal(
          <div
            ref={menuRef}
            id="portfolio-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            data-lenis-prevent
            className="nav-overlay-panel fixed inset-x-0 bottom-0 top-[4.25rem] z-[60] flex flex-col gap-1 overflow-y-auto border-b border-[var(--card-border)] bg-[var(--background)] px-5 pb-8 pt-6 backdrop-blur-xl lg:hidden sm:px-8"
          >
            {navLinks.map((link, index) => (
              <motion.div key={link.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.055 }}>
                <Link href={link.href} className="nav-overlay-link" onClick={() => setIsOpen(false)}>
                  <span>{link.name}</span>
                  <ArrowUpRight size={23} aria-hidden="true" />
                </Link>
              </motion.div>
            ))}
          </div>,
          document.body,
        )}
      </nav>
    </header>
  );
}
