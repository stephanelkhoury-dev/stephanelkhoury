'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, ChevronRight, Activity, Cpu } from 'lucide-react';
import { experienceItems, experienceSlug } from '@/lib/experiences';
import type { ExperienceContent } from './types';
export default function PremiumExperience({ content }: { content: ExperienceContent }) {
  const items = experienceItems(content);

  return (
    <section id="experience" className="border-t border-zinc-300/80 bg-[var(--background)] py-20 dark:border-zinc-800 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-12">
        <div className="mb-12 max-w-3xl md:mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-secondary)]">
              <Cpu size={15} /> Career trajectory
            </h2>
            <h3 className="font-display text-5xl leading-[0.95] text-zinc-900 dark:text-white sm:text-6xl">{content.title}</h3>
            <p className="mt-5 max-w-2xl text-zinc-600 dark:text-zinc-400 sm:text-lg">{content.subtitle}</p>
          </motion.div>
        </div>

        <div className="max-w-5xl">
          {items.map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.45, delay: index * 0.035 }}
              className="group grid grid-cols-1 gap-3 border-t border-zinc-300 py-7 dark:border-zinc-800 md:grid-cols-[180px_1fr] md:gap-10 md:py-9"
            >
              <div className="flex items-start gap-3 pt-1">
                <Activity size={13} className={`mt-0.5 ${index === 0 ? 'text-[var(--accent-primary)]' : 'text-zinc-400'}`} />
                <span className="text-xs font-mono leading-5 text-zinc-500 dark:text-zinc-400">{item.year}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="flex items-center gap-2 text-xl font-semibold text-zinc-900 transition-colors group-hover:text-[var(--accent-primary)] dark:text-white md:text-2xl">
                    <Link href={`/experience/${experienceSlug(item)}`} className="inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)]">
                      {item.title}
                      <ChevronRight className="h-4 w-4 shrink-0 text-[var(--accent-primary)]" aria-hidden="true" />
                    </Link>
                  </h4>
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <Briefcase size={14} />
                    {item.company}
                  </div>
                </div>

                <p className="text-zinc-700 dark:text-zinc-400 leading-relaxed">{item.description}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                  {item.metrics.map((metric) => (
                    <span key={`${item.title}-${metric}`} className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {metric}
                    </span>
                  ))}
                </div>
                <Link href={`/experience/${experienceSlug(item)}`} className="project-link" aria-label={`View my work as ${item.title} at ${item.company}`}>
                  View my work <ChevronRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
