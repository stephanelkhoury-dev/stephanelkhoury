'use client';

import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MonitorPlay, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ProjectLogo from './ProjectLogo';
import { projectBrandNames, projectLogos } from '@/lib/featured-projects';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  imageUrl: string | null;
  imageFit?: 'cover' | 'contain';
  liveUrl: string | null;
  githubUrl: string | null;
};

export default function PremiumProjects({ projects }: { projects: ProjectRecord[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [previewProject, setPreviewProject] = useState<ProjectRecord | null>(null);
  const featuredProject = projects[0];
  const remainingProjects = projects.slice(1);

  useGSAP(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.visibilityState === 'hidden'
    ) return;

    gsap.utils.toArray<HTMLElement>('[data-project-media]').forEach((media) => {
      gsap.fromTo(media,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: media, start: 'top 86%', once: true },
        },
      );
      const imageLayer = media.querySelector<HTMLElement>('[data-project-image]');
      if (imageLayer) {
        gsap.fromTo(imageLayer,
          { scale: 1.06 },
          {
            scale: 1,
            duration: 0.95,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: media, start: 'top 86%', once: true },
          },
        );
      }
    });

    gsap.fromTo('[data-project-copy]',
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      },
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="projects" className="work-section">
      <div className="work-section-inner">
        <header className="work-intro" data-project-copy>
          <div>
            <p className="section-eyebrow">Selected work <span>/ {String(projects.length).padStart(2, '0')}</span></p>
            <h2 className="work-heading font-display">A few things made real.</h2>
          </div>
          <p className="work-intro-note">A selection of public websites and product experiences.</p>
        </header>

        {featuredProject && (
          <article className="project-featured group">
            <Link
              href={`/projects/${featuredProject.slug}`}
              className="project-featured-media project-media-reveal"
              data-project-media
              aria-label={`View ${featuredProject.title} project details`}
            >
              <div className="project-media-image" data-project-image>
                <ProjectLogo
                  src={projectLogos[featuredProject.slug]}
                  title={projectBrandNames[featuredProject.slug] ?? featuredProject.title}
                  featured
                />
              </div>
              <span className="project-media-index" aria-hidden="true">01 <span>/ {String(projects.length).padStart(2, '0')}</span></span>
            </Link>
            <div className="project-featured-copy" data-project-copy>
              <div>
                <p className="project-category">{featuredProject.summary}</p>
                <h3 className="font-display"><Link href={`/projects/${featuredProject.slug}`}>{featuredProject.title}</Link></h3>
                <p className="project-description">{featuredProject.description}</p>
              </div>
              <ProjectLinks project={featuredProject} onPreview={setPreviewProject} />
            </div>
          </article>
        )}

        <div className="project-grid">
          {remainingProjects.map((project, index) => (
            <article key={project.id} className="project-card group">
              <Link
                href={`/projects/${project.slug}`}
                className="project-card-media project-media-reveal"
                data-project-media
                aria-label={`View ${project.title} project details`}
              >
                <div className="project-media-image" data-project-image>
                  <ProjectLogo
                    src={projectLogos[project.slug]}
                    title={projectBrandNames[project.slug] ?? project.title}
                  />
                </div>
                <span className="project-media-index" aria-hidden="true">{String(index + 2).padStart(2, '0')}</span>
              </Link>
              <div className="project-card-copy" data-project-copy>
                <div>
                  <p className="project-category">{project.summary}</p>
                  <h3 className="font-display"><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
                  <p className="project-description">{project.description}</p>
                </div>
                <ProjectLinks project={project} onPreview={setPreviewProject} />
              </div>
            </article>
          ))}
        </div>
      </div>
      {previewProject && (
        <ProjectPreview project={previewProject} onClose={() => setPreviewProject(null)} />
      )}
    </section>
  );
}

function ProjectPreview({ project, onClose }: { project: ProjectRecord; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="project-preview-dialog"
      aria-labelledby="project-preview-title"
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          dialogRef.current?.close();
        }
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <header className="project-preview-header">
        <div>
          <p className="project-category">Project identity</p>
          <h2 id="project-preview-title">{project.title}</h2>
        </div>
        <div className="project-preview-actions">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
              Open live site <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          <button type="button" className="project-preview-close" onClick={() => dialogRef.current?.close()} aria-label="Close preview">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div className="project-preview-content">
        <ProjectLogo
          src={projectLogos[project.slug]}
          title={projectBrandNames[project.slug] ?? project.title}
          featured
        />
      </div>
    </dialog>
  );
}

function ProjectLinks({ project, onPreview }: { project: ProjectRecord; onPreview: (project: ProjectRecord) => void }) {
  return (
    <div className="project-links">
      <button type="button" className="project-link" onClick={() => onPreview(project)}>
        Preview <MonitorPlay size={15} aria-hidden="true" />
      </button>
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
          Live site <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      )}
      <Link href={`/projects/${project.slug}`} className="project-link">
        Case study <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}
