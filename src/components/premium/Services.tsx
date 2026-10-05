'use client';

import type { ComponentType, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Code2, MonitorCheck, BarChart3, Palette, CheckCircle2, Music, Blocks, Briefcase } from 'lucide-react';
import type { ServicesContent } from './types';

const iconMap: Record<string, ComponentType<{ className?: string; style?: CSSProperties }>> = {
  monitor: MonitorCheck,
  code: Code2,
  qa: CheckCircle2,
  seo: BarChart3,
  ui: Palette,
  docs: Blocks,
  music: Music,
  business: Briefcase,
};

export default function PremiumServices({ content }: { content: ServicesContent }) {
  const items = (content.items ?? []).slice(0, 4);
  const fallbackPalette = ['var(--accent-primary)', 'var(--accent-secondary)', 'var(--accent-primary)', 'var(--accent-secondary)'];

  return (
    <section id="services" className="py-16 md:py-24 bg-[var(--background)] relative border-t border-zinc-200/70 dark:border-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-secondary)]">Capabilities</h2>
            <h3 className="font-display text-4xl sm:text-5xl text-zinc-900 dark:text-white mb-4">{content.title}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg">{content.subtitle}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || Code2;
            const iconColor = item.iconColor || fallbackPalette[index % fallbackPalette.length];
            return (
              <motion.div
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative border-t border-zinc-300 py-7 dark:border-zinc-800 sm:py-8"
              >
                <div className="mb-4 inline-flex">
                  <Icon className="h-6 w-6" style={{ color: iconColor }} />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                <p className="max-w-xl text-sm leading-6 text-zinc-700 dark:text-zinc-400">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
