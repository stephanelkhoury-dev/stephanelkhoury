import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Briefcase, CalendarDays } from 'lucide-react';
import PremiumNavbar from '@/components/premium/Navbar';
import PremiumFooter from '@/components/premium/Footer';
import { getPublicContent } from '@/lib/bootstrap';
import { experienceItems, experienceSlug } from '@/lib/experiences';
import { experienceDetails } from '@/lib/experience-details';

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

const getExperiences = cache(async () => {
  const { blocks } = await getPublicContent();
  return experienceItems(blocks.find((block) => block.slug === 'experience-main')?.content);
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const items = await getExperiences();
  const item = items.find((entry) => experienceSlug(entry) === slug);
  if (!item) return { title: 'Experience Not Found' };
  const title = `${item.title} at ${item.company}`;
  return {
    title,
    description: item.description,
    alternates: { canonical: `/experience/${slug}` },
    openGraph: { title, description: item.description, url: `/experience/${slug}`, type: 'article' },
  };
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const items = await getExperiences();
  const item = items.find((entry) => experienceSlug(entry) === slug);
  if (!item) notFound();
  const details = experienceDetails[experienceSlug({ ...item, slug: undefined })];
  const achievements = item.achievements ?? details?.achievements ?? [];
  const tools = item.tools ?? details?.tools ?? [];
  const otherItems = items.filter((entry) => experienceSlug(entry) !== slug);

  return (
    <>
      <PremiumNavbar />
      <main id="main-content" className="min-h-screen bg-[var(--background)] px-5 pb-20 pt-28 text-[var(--foreground)] sm:px-8 md:px-12 md:pb-28">
        <div className="mx-auto max-w-[1400px]">
          <Link href="/#experience" className="project-link text-[var(--accent-primary)]">
            <ArrowLeft size={16} aria-hidden="true" /> Back to professional experience
          </Link>
          <header className="mb-12 mt-8 border-b border-[var(--card-border)] pb-10 md:mb-16 md:pb-14">
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)]">
              <Briefcase size={16} aria-hidden="true" /> {item.company}
            </p>
            <h1 className="max-w-5xl break-words font-display text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">{item.title}</h1>
            <p className="mt-6 flex items-center gap-2 text-sm text-[var(--muted)]">
              <CalendarDays size={16} aria-hidden="true" /> {item.year}
            </p>
          </header>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-20">
            <div className="min-w-0">
              <section aria-labelledby="work-heading">
                <h2 id="work-heading" className="font-display text-2xl sm:text-3xl">My work</h2>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">{item.description}</p>
                {achievements.length > 0 && (
                  <ul className="mt-8 divide-y divide-[var(--card-border)] border-y border-[var(--card-border)]">
                    {achievements.map((achievement, index) => (
                      <li key={`${index}-${achievement}`} className="flex gap-5 py-5">
                        <span aria-hidden="true" className="pt-1 text-xs tabular-nums text-[var(--accent-primary)]">{String(index + 1).padStart(2, '0')}</span>
                        <p className="min-w-0 break-words leading-7">{achievement}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              {Boolean(item.deliverables?.length) && (
                <section className="mt-12" aria-labelledby="deliverables-heading">
                  <h2 id="deliverables-heading" className="font-display text-2xl">Deliverables</h2>
                  <ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-[var(--muted)]">
                    {item.deliverables?.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
                  </ul>
                </section>
              )}
            </div>

            <aside className="min-w-0 border-t border-[var(--card-border)] pt-6 lg:border-t-0 lg:pt-0">
              <h2 className="font-display text-xl">Focus areas</h2>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-[var(--muted)]">
                {item.metrics.map((metric) => <li key={metric}>{metric}</li>)}
              </ul>
              {tools.length > 0 && (
                <section className="mt-9 border-t border-[var(--card-border)] pt-6" aria-labelledby="tools-heading">
                  <h2 id="tools-heading" className="font-display text-xl">Tools & technologies</h2>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[var(--muted)]">
                    {tools.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                </section>
              )}
            </aside>
          </div>

          {otherItems.length > 0 && (
            <nav aria-label="Other professional experiences" className="mt-20 border-t border-[var(--card-border)] pt-8">
              <h2 className="mb-6 font-display text-2xl">More experience</h2>
              <div className="grid gap-x-10 sm:grid-cols-2">
                {otherItems.map((entry) => (
                  <Link key={experienceSlug(entry)} href={`/experience/${experienceSlug(entry)}`} className="group flex items-center justify-between gap-4 border-b border-[var(--card-border)] py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)]">
                    <span className="min-w-0">
                      <span className="block text-xs text-[var(--muted)]">{entry.company}</span>
                      <span className="mt-1 block break-words font-medium group-hover:text-[var(--accent-primary)]">{entry.title}</span>
                    </span>
                    <ArrowUpRight size={18} className="shrink-0 text-[var(--accent-primary)]" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </main>
      <PremiumFooter />
    </>
  );
}