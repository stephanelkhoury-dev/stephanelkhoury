'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { AboutContent } from './types';

export default function PremiumAbout({ content }: { content: AboutContent }) {
  const paragraphs = (content.paragraphs ?? []).slice(0, 2);

  return (
    <section id="about" className="about-section">
      <div className="about-section-inner">
        <div className="about-grid">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }} className="about-copy space-y-8">
            <div>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-secondary)]">{content.kicker}</h2>
                <h3 className="font-display text-4xl sm:text-5xl text-zinc-900 dark:text-white mb-5 md:mb-6">
                {content.headline}{' '}
                  <span className="text-[var(--accent-primary)]">{content.headlineAccent}</span>
              </h3>
            </div>

            <div className="space-y-5 md:space-y-6 text-zinc-700 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

          </motion.div>

          <div className="about-aside">
            <figure className="about-portrait">
              <Image
                src="/images/profile/stephan-profile.jpg"
                alt="Portrait of Stephan El Khoury"
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 55vw, 34vw"
                className="object-cover"
              />
            </figure>

            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.12 }} className="about-process">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-secondary)]">How I work</p>
            <ol className="divide-y divide-[var(--card-border)]">
              <li className="grid grid-cols-[2.5rem_1fr] gap-3 py-5 first:pt-0">
                <span className="font-mono text-sm text-[var(--accent-primary)]">01</span>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">Build</h4>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Frontend and full-stack development.</p>
                </div>
              </li>
              <li className="grid grid-cols-[2.5rem_1fr] gap-3 py-5">
                <span className="font-mono text-sm text-[var(--accent-primary)]">02</span>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">Validate</h4>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Quality assurance through functional and regression testing.</p>
                </div>
              </li>
              <li className="grid grid-cols-[2.5rem_1fr] gap-3 py-5 last:pb-0">
                <span className="font-mono text-sm text-[var(--accent-primary)]">03</span>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">Improve</h4>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Technical SEO and performance considerations.</p>
                </div>
              </li>
            </ol>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
