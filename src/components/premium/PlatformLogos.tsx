'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type LogoItem = {
  name: string;
  slug: string;
  logoUrl: string;
};

export default function PlatformLogos({ items }: { items: LogoItem[] }) {
  if (items.length === 0) return null;

  const repeated = [...items, ...items, ...items];

  return (
    <section id="platforms" className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-900/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-2">Stack & Platforms</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">Platforms I Work On</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Hover to pause. Click any logo to view my experience with that platform.</p>
          </motion.div>
        </div>

        <div className="logo-marquee group">
          <div className="logo-marquee-track group-hover:[animation-play-state:paused]">
            {repeated.map((item, index) => (
              <Link
                key={`${item.slug}-${index}`}
                href={`/platforms/${item.slug}`}
                className="logo-pill"
                aria-label={`Open ${item.name} platform page`}
                title={item.name}
              >
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="logo-pill-image"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
