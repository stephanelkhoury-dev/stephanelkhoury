import Link from 'next/link';
import type { MultigraphicBlock, MultigraphicPageContent } from '@/lib/multigraphic-page';

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object') return value as Record<string, unknown>;
  return {};
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asItems(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object');
}

function asStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function SectionTitle({ kicker, title, subtitle }: { kicker?: string; title?: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      {kicker ? <p className="text-[11px] tracking-[0.2em] uppercase text-cyan-300 mb-3">{kicker}</p> : null}
      {title ? <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">{title}</h2> : null}
      {subtitle ? <p className="mt-3 text-zinc-400 max-w-3xl leading-relaxed">{subtitle}</p> : null}
    </div>
  );
}

function renderBlock(block: MultigraphicBlock) {
  const content = asRecord(block.content);

  if (block.type === 'hero') {
    return (
      <section id={block.anchor} className="py-20 md:py-24 border-b border-zinc-800/70">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-5">{asString(content.badge)}</p>
            <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-tight max-w-4xl">{asString(content.title)}</h1>
            <p className="text-zinc-300 mt-6 max-w-3xl text-lg leading-relaxed">{asString(content.description)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {asString(content.primaryCtaLabel) ? (
                <a href={asString(content.primaryCtaHref)} className="px-6 py-3 rounded-lg bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors">
                  {asString(content.primaryCtaLabel)}
                </a>
              ) : null}
              {asString(content.secondaryCtaLabel) ? (
                <a href={asString(content.secondaryCtaHref)} className="px-6 py-3 rounded-lg border border-zinc-700 text-zinc-200 text-sm font-medium hover:border-zinc-500 transition-colors">
                  {asString(content.secondaryCtaLabel)}
                </a>
              ) : null}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/55 p-6 md:p-8">
            <div className="grid grid-cols-2 gap-3">
              <InfoCard label="Delivery" value="Enterprise" />
              <InfoCard label="Quality" value="QA-first" />
              <InfoCard label="Performance" value="SEO + Speed" />
              <InfoCard label="Model" value="End-to-End" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (block.type === 'highlights') {
    const items = asItems(content.items);
    return (
      <section id={block.anchor} className="py-12 border-b border-zinc-800/70">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <article key={`highlight-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-5">
              <h3 className="font-semibold text-white text-sm">{asString(item.title)}</h3>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{asString(item.desc)}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'about') {
    const stats = asItems(content.stats);
    const paragraphs = asStrings(content.paragraphs);
    return (
      <section id={block.anchor} className="py-16 border-b border-zinc-800/70">
        <SectionTitle kicker={asString(content.kicker)} title={asString(content.heading)} />
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8">
          <div className="space-y-4 text-zinc-300">
            {paragraphs.map((paragraph, idx) => (
              <p key={`paragraph-${idx}`} className="leading-relaxed">{paragraph}</p>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, idx) => (
              <article key={`stat-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
                <p className="text-2xl font-semibold text-white">{asString(stat.value)}</p>
                <p className="text-xs tracking-wide uppercase text-zinc-400 mt-1">{asString(stat.label)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (block.type === 'services') {
    const items = asItems(content.items);
    return (
      <section id={block.anchor} className="py-16 border-b border-zinc-800/70">
        <SectionTitle kicker={asString(content.kicker)} title={asString(content.title)} subtitle={asString(content.subtitle)} />
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <article key={`service-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-6">
              <h3 className="font-semibold text-white">{asString(item.title)}</h3>
              <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{asString(item.description)}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'projects') {
    const items = asItems(content.items);
    return (
      <section id={block.anchor} className="py-16 border-b border-zinc-800/70">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <SectionTitle kicker={asString(content.kicker)} title={asString(content.title)} subtitle={asString(content.subtitle)} />
          {asString(content.ctaLabel) ? (
            <a href={asString(content.ctaHref)} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-200 hover:border-zinc-500 transition-colors">
              {asString(content.ctaLabel)}
            </a>
          ) : null}
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item, idx) => {
            const tags = asStrings(item.tags);
            const href = asString(item.href);
            const imageUrl = asString(item.imageUrl);
            return (
              <article key={`project-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 overflow-hidden">
                {imageUrl ? <img src={imageUrl} alt={asString(item.title)} className="h-40 w-full object-cover" /> : null}
                <div className="p-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300">{asString(item.category)}</p>
                  <h3 className="text-lg font-semibold text-white mt-2">{asString(item.title)}</h3>
                  <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{asString(item.description)}</p>
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <span key={`${asString(item.title)}-${tag}`} className="text-[10px] uppercase rounded-md border border-zinc-700 px-2 py-1 text-zinc-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {href && href !== '#' ? (
                    <div className="mt-4">
                      <Link href={href} className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
                        {asString(item.linkLabel) || 'View project page'}
                      </Link>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  if (block.type === 'stack') {
    const items = asStrings(content.items);
    return (
      <section id={block.anchor} className="py-16 border-b border-zinc-800/70">
        <SectionTitle title={asString(content.title)} subtitle={asString(content.subtitle)} />
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <span key={item} className="px-3 py-2 rounded-full border border-zinc-700 bg-zinc-900/60 text-zinc-300 text-sm">{item}</span>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'skills') {
    const groups = asItems(content.groups);
    return (
      <section id={block.anchor} className="py-16 border-b border-zinc-800/70">
        <SectionTitle kicker={asString(content.kicker)} title={asString(content.title)} subtitle={asString(content.subtitle)} />
        <div className="grid md:grid-cols-2 gap-5">
          {groups.map((group, idx) => (
            <article key={`skill-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-5">
              <h3 className="font-semibold text-white">{asString(group.title)}</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {asStrings(group.items).map((item) => (
                  <span key={`${asString(group.title)}-${item}`} className="text-xs rounded-md border border-zinc-700 px-2 py-1 text-zinc-300">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'experience') {
    const items = asItems(content.items);
    return (
      <section id={block.anchor} className="py-16 border-b border-zinc-800/70">
        <SectionTitle kicker={asString(content.kicker)} title={asString(content.title)} subtitle={asString(content.subtitle)} />
        <div className="space-y-4">
          {items.map((item, idx) => (
            <article key={`exp-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">{asString(item.period)}</p>
              <h3 className="text-xl font-semibold text-white mt-1">{asString(item.title)}</h3>
              <p className="text-sm text-zinc-300 mt-1">{asString(item.company)}{asString(item.meta) ? ` · ${asString(item.meta)}` : ''}</p>
              <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{asString(item.description)}</p>
              {asStrings(item.bullets).length > 0 ? (
                <ul className="mt-3 list-disc pl-5 text-sm text-zinc-300 space-y-1">
                  {asStrings(item.bullets).map((bullet) => (
                    <li key={`${asString(item.title)}-${bullet}`}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {asStrings(item.tags).length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {asStrings(item.tags).map((tag) => (
                    <span key={`${asString(item.title)}-${tag}`} className="text-xs rounded-md border border-zinc-700 px-2 py-1 text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'pipeline') {
    const items = asItems(content.items);
    return (
      <section id={block.anchor} className="py-16 border-b border-zinc-800/70">
        <SectionTitle kicker={asString(content.kicker)} title={asString(content.title)} />
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <article key={`pipeline-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{asString(item.status)}</p>
              <h3 className="text-lg font-semibold text-white mt-2">{asString(item.title)}</h3>
              <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-zinc-300">
                {asStrings(item.points).map((point) => (
                  <li key={`${asString(item.title)}-${point}`}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'testimonials') {
    const items = asItems(content.items);
    return (
      <section id={block.anchor} className="py-16 border-b border-zinc-800/70">
        <SectionTitle kicker={asString(content.kicker)} title={asString(content.title)} subtitle={asString(content.subtitle)} />
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <article key={`testimonial-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-5">
              <p className="text-zinc-300 leading-relaxed">“{asString(item.quote)}”</p>
              <p className="text-sm text-white mt-4">{asString(item.author)}</p>
              <p className="text-xs uppercase tracking-wide text-zinc-400 mt-1">{asString(item.role)}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'contact') {
    const form = asRecord(content.form);
    return (
      <section id={block.anchor} className="py-16">
        <SectionTitle kicker={asString(content.kicker)} title={asString(content.title)} subtitle={asString(content.subtitle)} />
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-6 space-y-3">
            <p className="text-sm text-zinc-300"><span className="text-zinc-400">{asString(content.emailLabel)}:</span> {asString(content.email)}</p>
            <p className="text-sm text-zinc-300"><span className="text-zinc-400">{asString(content.phoneLabel)}:</span> {asString(content.phone)}</p>
            <p className="text-sm text-zinc-300"><span className="text-zinc-400">{asString(content.locationLabel)}:</span> {asString(content.location)}</p>
            <p className="text-sm text-zinc-400 pt-2">{asString(content.socialLabel)}</p>
          </div>

          <form className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-6 space-y-3">
            <Field label={asString(form.fullNameLabel)} placeholder={asString(form.fullNamePlaceholder)} />
            <Field label={asString(form.emailLabel)} placeholder={asString(form.emailPlaceholder)} />
            <Field label={asString(form.subjectLabel)} placeholder={asString(form.subjectPlaceholder)} />
            <Field label={asString(form.messageLabel)} placeholder={asString(form.messagePlaceholder)} multiline />
            <button type="button" className="w-full mt-2 px-4 py-2.5 rounded-lg bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors">{asString(form.submitLabel)}</button>
          </form>
        </div>
      </section>
    );
  }

  return null;
}

function Field({ label, placeholder, multiline = false }: { label: string; placeholder: string; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm text-zinc-300">{label}</span>
      {multiline ? (
        <textarea className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" rows={4} placeholder={placeholder} />
      ) : (
        <input className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" placeholder={placeholder} />
      )}
    </label>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="text-sm text-zinc-200 mt-1 font-medium">{value}</p>
    </div>
  );
}

export default function MultigraphicPageRenderer({ page }: { page: MultigraphicPageContent }) {
  const activeBlocks = page.blocks.filter((block) => block.enabled);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-4">
          <a href="#home" className="flex items-center gap-3 min-w-0">
            {page.branding.logoUrl ? (
              <img src={page.branding.logoUrl} alt={page.branding.name || 'Brand logo'} className="h-9 w-9 rounded-md object-cover border border-zinc-700" />
            ) : (
              <span className="text-sm md:text-base text-cyan-300 shrink-0">{page.branding.symbol}</span>
            )}
            <div className="min-w-0">
              <p className="text-sm md:text-base font-semibold tracking-wide truncate">{page.branding.name}</p>
              <p className="text-xs text-zinc-400 truncate">{page.branding.subtitle}</p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-6 text-sm text-zinc-300">
            {page.nav.map((item) => (
              <a key={`${item.label}-${item.anchor}`} href={`#${item.anchor}`} className="hover:text-white transition-colors">
                {item.label}
              </a>
            ))}
          </nav>

          {page.primaryAction.label ? (
            <a href={page.primaryAction.href} className="text-xs md:text-sm font-medium px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors">
              {page.primaryAction.label}
            </a>
          ) : null}
        </div>
      </header>

      <main id="home" className="max-w-7xl mx-auto px-6 md:px-12">
        {activeBlocks.map((block) => (
          <div key={block.id}>{renderBlock(block)}</div>
        ))}
      </main>

      <footer className="border-t border-zinc-800/80 bg-zinc-950/95">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 text-sm text-zinc-400">
          <div>
            <p className="text-white font-semibold tracking-wide">{page.footer.brandTop}</p>
            <p className="text-white font-semibold tracking-wide">{page.footer.brandBottom}</p>
            <p className="mt-2">{page.footer.copyright}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {page.footer.links.map((link) => (
              <a key={`${link.label}-${link.anchor}`} href={`#${link.anchor}`} className="hover:text-zinc-200 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
