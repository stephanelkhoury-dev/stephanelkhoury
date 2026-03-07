import Link from 'next/link';

type SystemsShowcaseProps = {
  systems: {
    id: string;
    slug: string;
    name: string;
    logoUrl: string;
    shortDescription: string;
  }[];
};

export default function SystemsShowcase({ systems }: SystemsShowcaseProps) {
  return (
    <section id="systems" className="py-20 px-6 md:px-20 bg-[#0B001F]/30">
      <h2 className="text-3xl font-bold mb-3 text-center">Supported Systems</h2>
      <p className="text-gray-400 text-center mb-10">Click a logo to view platform-specific experience, links, and certificates.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {systems.map((system) => (
          <Link
            key={system.id}
            href={`/systems/${system.slug}`}
            className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#3b82f6]/50 transition-colors"
          >
            <div className="h-16 mb-3 flex items-center justify-center">
              <img src={system.logoUrl} alt={system.name} className="max-h-14 object-contain" />
            </div>
            <h3 className="text-lg font-semibold group-hover:text-[#3b82f6] transition-colors">{system.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{system.shortDescription}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
