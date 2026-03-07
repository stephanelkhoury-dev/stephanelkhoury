type BlockRendererProps = {
  block: {
    id: string;
    type: 'HERO' | 'ABOUT' | 'EXPERIENCE' | 'CONTACT';
    title: string;
    subtitle: string | null;
    content: unknown;
  };
};

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  const content = asRecord(block.content);

  if (block.type === 'HERO') {
    return (
      <section id="hero" className="py-24 px-6 md:px-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{block.title}</h1>
        {block.subtitle && <p className="text-xl text-gray-300 mb-4">{block.subtitle}</p>}
        <p className="text-gray-400 mb-8 max-w-3xl mx-auto">{String(content.headline || '')}</p>
        {typeof content.ctaHref === 'string' && typeof content.ctaLabel === 'string' && (
          <a
            href={content.ctaHref}
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#10b981] text-black font-semibold"
          >
            {content.ctaLabel}
          </a>
        )}
      </section>
    );
  }

  if (block.type === 'ABOUT') {
    const skills = asStringArray(content.skills);

    return (
      <section id="about" className="py-20 px-6 md:px-20">
        <h2 className="text-3xl font-bold mb-2">{block.title}</h2>
        {block.subtitle && <p className="text-gray-400 mb-6">{block.subtitle}</p>}
        <p className="text-gray-300 mb-6">{String(content.bio || '')}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">Location: {String(content.location || '')}</div>
          <div className="bg-white/5 rounded-lg p-4">Availability: {String(content.availability || '')}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="px-3 py-1 rounded-full bg-[#3b82f6]/20 border border-white/10 text-sm">
              {skill}
            </span>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'EXPERIENCE') {
    const bullets = asStringArray(content.bullets);
    const technologies = asStringArray(content.technologies);

    return (
      <section id="experience" className="py-20 px-6 md:px-20">
        <h2 className="text-3xl font-bold mb-2">{block.title}</h2>
        {block.subtitle && <p className="text-[#3b82f6] text-lg mb-2">{block.subtitle}</p>}
        <p className="text-gray-400 mb-6">{String(content.period || '')}</p>
        <ul className="space-y-2 mb-6">
          {bullets.map((item) => (
            <li key={item} className="text-gray-300 border-l-2 border-[#3b82f6]/50 pl-3">
              {item}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span key={tech} className="px-3 py-1 rounded-full bg-[#10b981]/20 border border-white/10 text-sm">
              {tech}
            </span>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'CONTACT') {
    return (
      <section id="contact" className="py-20 px-6 md:px-20">
        <h2 className="text-3xl font-bold mb-2">{block.title}</h2>
        {block.subtitle && <p className="text-gray-400 mb-6">{block.subtitle}</p>}
        <div className="grid md:grid-cols-3 gap-4">
          <a className="bg-white/5 rounded-lg p-4" href={`mailto:${String(content.email || '')}`}>
            Email: {String(content.email || '')}
          </a>
          <a className="bg-white/5 rounded-lg p-4" href={`tel:${String(content.phone || '')}`}>
            Phone: {String(content.phone || '')}
          </a>
          <div className="bg-white/5 rounded-lg p-4">Location: {String(content.location || '')}</div>
        </div>
      </section>
    );
  }

  return null;
}
