import Link from 'next/link';
import { notFound } from 'next/navigation';
import PremiumNavbar from '@/components/premium/Navbar';
import PremiumFooter from '@/components/premium/Footer';
import { prisma } from '@/lib/prisma';
import { defaultProjects } from '@/lib/default-content';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const project = process.env.DATABASE_URL
    ? await prisma.project.findUnique({ where: { slug } })
    : defaultProjects.find((item) => item.slug === slug);

  if (!project || !project.isActive) {
    notFound();
  }

  const technologies = asStringArray(project.technologies);

  return (
    <>
      <PremiumNavbar />
      <main className="min-h-screen pt-28 px-6 md:px-12 bg-zinc-950 text-zinc-50">
        <section className="max-w-5xl mx-auto">
          <Link href="/#projects" className="text-blue-400 text-sm hover:text-blue-300">
            ← Back to Featured Work
          </Link>

          <div className="mt-5 grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <div className="h-72 md:h-96 bg-zinc-800">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="p-8">
                <p className="text-xs uppercase tracking-widest text-blue-400 mb-2">Portfolio Project</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{project.title}</h1>
                <p className="text-zinc-300 text-lg leading-relaxed">{project.description}</p>
              </div>
            </article>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-xl font-semibold mb-3">Overview</h2>
                <p className="text-zinc-300">{project.summary}</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-xl font-semibold mb-3">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((technology) => (
                    <span key={technology} className="text-xs px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-700 text-zinc-300">
                      {technology}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
                <h2 className="text-xl font-semibold">Links</h2>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="block text-emerald-400 hover:text-emerald-300">
                    Live Project
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="block text-blue-400 hover:text-blue-300">
                    Source Code
                  </a>
                )}
                {!project.liveUrl && !project.githubUrl && (
                  <p className="text-zinc-400 text-sm">Project links can be added from the CMS dashboard.</p>
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
