'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import HeroSceneSlot from './HeroSceneSlot';
import type { HeroContent } from './types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function PremiumHero({ content }: { content: HeroContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneProgress = useRef(0);
  const title = content.title || 'Stephan El Khoury';
  const nameParts = title.trim().split(/\s+/);
  const firstLine = nameParts.slice(0, -1).join(' ') || title;
  const lastLine = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const description = content.description || 'Full-stack development, quality assurance, and technical SEO for digital products.';

  useGSAP(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.visibilityState === 'hidden'
    ) return;

    gsap.fromTo('[data-hero-line-inner]',
      { yPercent: 108 },
      { yPercent: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' },
    );
    gsap.fromTo('[data-hero-meta]',
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out', delay: 0.22 },
    );
    gsap.to(sceneProgress, {
      current: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.45,
        onUpdate: (trigger) => {
          sceneProgress.current = trigger.progress;
        },
        onLeaveBack: () => {
          sceneProgress.current = 0;
        },
      },
    });
    gsap.to('.portfolio-scroll-cue', {
      autoAlpha: 0,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '35% top',
        scrub: true,
      },
    });
    gsap.to('.portfolio-hero-copy', {
      y: -34,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.45,
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="portfolio-hero" aria-labelledby="hero-title">
      <figure className="portfolio-hero-figure" aria-hidden="true">
        <HeroSceneSlot progress={sceneProgress} />
        <figcaption className="portfolio-hero-caption">
          <span>STRUCTURE <span>/</span> SIGNAL <span>/</span> MOTION</span>
          <span>SE—01</span>
        </figcaption>
      </figure>
      <div className="portfolio-hero-inner">
        <div className="portfolio-hero-copy">
          <div className="portfolio-hero-heading">
            <div className="portfolio-hero-name-group">
              <p className="portfolio-eyebrow" data-hero-meta>Advertising projects</p>
              <h1 id="hero-title" className="portfolio-hero-title font-display" aria-label={title}>
                <span className="sr-only">{title}</span>
                <span aria-hidden="true" className="portfolio-hero-line"><span data-hero-line-inner>{firstLine}</span></span>
                {lastLine && <span aria-hidden="true" className="portfolio-hero-line"><span data-hero-line-inner>{lastLine}</span></span>}
              </h1>
            </div>
          </div>

          <div className="portfolio-hero-intro" data-hero-meta>
            <p>{description}</p>
            <div className="portfolio-hero-actions">
              <a href="#projects" className="portfolio-action portfolio-action-primary">
                Selected work <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href="#contact" className="portfolio-action portfolio-action-secondary">
                Contact <ArrowDown size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="portfolio-hero-disciplines" data-hero-meta aria-label="Areas of work">
            <span>Product engineering</span>
            <span aria-hidden="true">/</span>
            <span>Technical SEO</span>
            <span aria-hidden="true">/</span>
            <span>Quality assurance</span>
          </div>
        </div>
        <span className="portfolio-scroll-cue" data-hero-meta><ArrowDown size={13} aria-hidden="true" /> Scroll to explore</span>
      </div>
    </section>
  );
}
