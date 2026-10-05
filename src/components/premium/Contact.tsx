'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Send, MapPin, Phone } from 'lucide-react';
import type { FormEvent } from 'react';
import type { ContactContent } from './types';

export default function PremiumContact({ content }: { content: ContactContent }) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.email) return;

    const formData = new FormData(event.currentTarget);
    const subject = String(formData.get('subject') || 'Portfolio inquiry');
    const body = [
      `Name: ${String(formData.get('name') || '')}`,
      `Email: ${String(formData.get('email') || '')}`,
      '',
      String(formData.get('message') || ''),
    ].join('\n');

    window.location.href = `mailto:${content.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="contact-finale relative overflow-hidden border-t border-[#191a18]/15 bg-[#e9e8e1] py-20 dark:border-white/15 dark:bg-zinc-950 md:py-32">

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 sm:px-8 md:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="lg:col-span-5">
            <div className="space-y-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-secondary)]">Get in touch <span className="ml-2 font-mono text-[var(--accent-primary)]">/ 06</span></p>
              <h2 className="max-w-[10ch] font-display text-5xl leading-[0.94] text-[var(--foreground)] sm:text-6xl md:text-7xl">
                {content.title}
              </h2>
              <p className="max-w-md text-base leading-7 text-zinc-700 dark:text-zinc-300 sm:text-lg">{content.subtitle}</p>
            </div>

            <div className="mt-10 grid gap-5 border-t border-[#191a18]/20 pt-7 dark:border-white/20 sm:grid-cols-2 lg:grid-cols-1">
              {content.email && (
                <a href={`mailto:${content.email}`} className="contact-detail group">
                  <Mail className="h-4 w-4 text-[var(--accent-primary)]" />
                  <span><span className="contact-detail-label">Email</span><span className="contact-detail-value">{content.email}</span></span>
                </a>
              )}
              {content.phone && (
                <a href={`tel:${content.phone}`} className="contact-detail group">
                  <Phone className="h-4 w-4 text-[var(--accent-primary)]" />
                  <span><span className="contact-detail-label">Phone</span><span className="contact-detail-value">{content.phone}</span></span>
                </a>
              )}
              <div className="contact-detail">
                <MapPin className="h-4 w-4 text-[var(--accent-primary)]" />
                <span><span className="contact-detail-label">Location</span><span className="contact-detail-value">{content.location}</span></span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {content.linkedin && <a href={content.linkedin} target="_blank" rel="noreferrer" className="contact-social" aria-label="Open LinkedIn profile"><Linkedin className="h-4 w-4" /></a>}
              {content.github && <a href={content.github} target="_blank" rel="noreferrer" className="contact-social" aria-label="Open GitHub profile"><Github className="h-4 w-4" /></a>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.08 }} className="lg:col-span-6 lg:col-start-7">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="contact-field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" required autoComplete="name" placeholder="Your name" />
                </div>
                <div className="contact-field">
                  <label htmlFor="email">Email address</label>
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
                </div>
              </div>
              <div className="contact-field">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" required placeholder="Project inquiry" />
              </div>
              <div className="contact-field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} required placeholder="Tell me about your project, goals, or technical needs..." />
              </div>
              <button type="submit" disabled={!content.email} className="contact-submit">
                Continue by email <Send className="h-4 w-4" />
              </button>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Your email app will open with the message ready to send.</p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
