import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import PremiumNavbar from '@/components/premium/Navbar';
import PremiumFooter from '@/components/premium/Footer';
import ProjectLogo from '@/components/premium/ProjectLogo';
import { featuredProjectCopy, featuredProjectSlugs, projectBrandNames, projectLogos } from '@/lib/featured-projects';
import { prisma } from '@/lib/prisma';
import { defaultProjects } from '@/lib/default-content';

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getProjectBySlug(slug: string) {
  return process.env.DATABASE_URL
    ? prisma.project.findUnique({ where: { slug } })
    : defaultProjects.find((item) => item.slug === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.stephanelkhoury.com';

  if (!project || !project.isActive || !featuredProjectSlugs.has(slug) || !project.liveUrl) {
    return {
      title: 'Project Not Found',
    };
  }

  const projectUrl = `${siteUrl}/projects/${project.slug}`;
  const imageUrl = projectLogos[slug];

  return {
    title: `${project.title}`,
    description: featuredProjectCopy[slug].description,
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      title: project.title,
      description: featuredProjectCopy[slug].description,
      url: projectUrl,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl, alt: project.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: featuredProjectCopy[slug].description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);

  if (!project || !project.isActive || !featuredProjectSlugs.has(slug) || !project.liveUrl) {
    notFound();
  }

  const featuredCopy = featuredProjectCopy[slug];

  return (
    <>
      <PremiumNavbar />
      <main id="main-content" className="project-detail-page min-h-screen bg-[var(--background)] px-5 pb-20 pt-28 text-[var(--foreground)] sm:px-8 md:px-12 md:pb-28">
        <section className="mx-auto max-w-[1400px]">
          <Link href="/#projects" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] transition-colors hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent-primary)]">
            <ArrowLeft size={16} /> Back to selected work
          </Link>

          <header className="mb-10 mt-8 max-w-4xl md:mb-14">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-secondary)]">{featuredCopy.summary}</p>
            <h1 className="max-w-[14ch] font-display text-5xl leading-[0.95] text-[var(--foreground)] sm:text-6xl md:text-7xl">{project.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">{featuredCopy.description}</p>
          </header>

          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <ProjectLogo
                src={projectLogos[slug]}
                title={projectBrandNames[slug] ?? project.title}
                featured
              />
            </div>

            <aside className="border-t border-zinc-300 pt-6 dark:border-zinc-700 lg:col-span-3 lg:col-start-10 lg:border-t-0 lg:pt-0">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-secondary)]">Explore</h2>
              <div className="flex flex-col items-start gap-4">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 border-b border-[var(--accent-primary)]/50 pb-1 text-sm font-semibold text-[var(--accent-primary)] hover:opacity-75">
                    Visit live site
                    <ArrowUpRight size={15} />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                    Source code
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <PremiumFooter />
    </>
  );
}
