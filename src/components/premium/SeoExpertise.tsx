'use client';

import { motion } from 'framer-motion';
import { Bot, Search, Workflow } from 'lucide-react';

const pillars = [
  {
    icon: Search,
    title: 'Technical foundations',
    description:
      'Crawlability, metadata, structured data, internal linking, rendering, and indexation.',
  },
  {
    icon: Bot,
    title: 'Search and AI readiness',
    description:
      'Clear page structure, useful answers, and entity context for search engines and answer systems.',
  },
  {
    icon: Workflow,
    title: 'Engineering execution',
    description:
      'Implementing approved improvements in React and Next.js codebases, from templates to rendering behavior.',
  },
];

export default function PremiumSeoExpertise() {
  return (
    <section id="seo-expertise" className="py-16 md:py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200/70 dark:border-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="max-w-3xl mb-10 md:mb-14">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-secondary)]">Search</h2>
            <h3 className="font-display text-4xl sm:text-5xl text-zinc-900 dark:text-white mb-5">
              Technical SEO, connected to the code.
            </h3>
            <p className="max-w-2xl text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
              Search requirements belong in the product itself: its structure, content, rendering, and technical foundations.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-x-10 md:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="border-t border-zinc-300 py-6 dark:border-zinc-800 sm:py-8"
              >
                <div className="mb-5 flex h-9 w-9 items-center justify-center text-[var(--accent-primary)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">{pillar.title}</h4>
                <p className="max-w-sm text-sm leading-6 text-zinc-700 dark:text-zinc-400">{pillar.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}