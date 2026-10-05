import PremiumNavbar from '@/components/premium/Navbar';
import PremiumHero from '@/components/premium/Hero';
import PremiumAbout from '@/components/premium/About';
import PremiumServices from '@/components/premium/Services';
import PremiumProjects from '@/components/premium/Projects';
import PlatformLogos from '@/components/premium/PlatformLogos';
import PremiumSeoExpertise from '@/components/premium/SeoExpertise';
import PremiumSkills from '@/components/premium/Skills';
import PremiumExperience from '@/components/premium/Experience';
import PremiumArchitecture from '@/components/premium/Architecture';
import PremiumContact from '@/components/premium/Contact';
import PremiumFooter from '@/components/premium/Footer';
import { getPublicContent } from '@/lib/bootstrap';
import { defaultProjects, defaultSystems } from '@/lib/default-content';
import { featuredProjectCopy, featuredProjectSlugs } from '@/lib/featured-projects';
import type { Metadata } from 'next';
import type {
  HeroContent,
  AboutContent,
  ServicesContent,
  SkillsContent,
  ExperienceContent,
  ArchitectureContent,
  ContactContent,
} from '@/components/premium/types';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Full-Stack Developer, SEO Expert, and AI Search Expert',
  description:
    'Explore the portfolio of Stephan El Khoury featuring full-stack projects, technical SEO, AI search optimization, client platforms, QA, and performance-driven product delivery.',
  keywords: [
    'full-stack developer Lebanon',
    'SEO expert Lebanon',
    'AI search expert',
    'AEO consultant',
    'GEO consultant',
    'technical SEO specialist',
    'Next.js SEO expert',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Stephan El Khoury | Full-Stack Developer, SEO Expert, AI Search Expert',
    description:
      'Full-stack product delivery with technical SEO, AI search optimization, performance engineering, QA, and scalable web platforms.',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/images/profile/stephan-profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Stephan El Khoury portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stephan El Khoury | Full-Stack Developer, SEO Expert, AI Search Expert',
    description:
      'Technical SEO, AI search optimization, QA, and full-stack engineering for high-performance digital products.',
    images: ['/images/profile/stephan-profile.jpg'],
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  return {};
}

export default async function Home() {
  const { blocks, projects, systems } = await getPublicContent();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.stephanelkhoury.com';
  const bySlug = Object.fromEntries(blocks.map((block) => [block.slug, block]));

  const heroBlock = bySlug['hero-main'];
  const aboutBlock = bySlug['about-main'];
  const servicesBlock = bySlug['services-main'];
  const skillsBlock = bySlug['skills-main'];
  const experienceBlock = bySlug['experience-main'];
  const architectureBlock = bySlug['architecture-main'];
  const contactBlock = bySlug['contact-main'];

  const hero = {
    ...asRecord(heroBlock?.content),
    title: heroBlock?.title,
    subtitle: heroBlock?.subtitle,
  } as HeroContent;
  const about = {
    ...asRecord(aboutBlock?.content),
    title: aboutBlock?.title,
    subtitle: aboutBlock?.subtitle,
    paragraphs: [
      'My experience spans frontend development, full-stack engineering, and quality assurance.',
      'I bring technical SEO into product delivery so search requirements are considered alongside implementation and testing.',
    ],
    stats: [],
  } as AboutContent;
  const services = {
    ...asRecord(servicesBlock?.content),
    title: servicesBlock?.title,
    subtitle: servicesBlock?.subtitle,
  } as ServicesContent;
  const skills = {
    ...asRecord(skillsBlock?.content),
    title: skillsBlock?.title,
    subtitle: skillsBlock?.subtitle,
  } as SkillsContent;
  const experience = {
    ...asRecord(experienceBlock?.content),
    title: experienceBlock?.title,
    subtitle: experienceBlock?.subtitle,
  } as ExperienceContent;
  const architecture = {
    ...asRecord(architectureBlock?.content),
    title: architectureBlock?.title,
    subtitle: architectureBlock?.subtitle,
  } as ArchitectureContent;
  const contact = {
    ...asRecord(contactBlock?.content),
    title: contactBlock?.title,
    subtitle: contactBlock?.subtitle,
  } as ContactContent;

  const defaultProjectImageBySlug = new Map<string, string>(
    defaultProjects.map((project) => [project.slug, project.imageUrl])
  );

  const mappedProjects = projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    description: project.description,
    imageUrl: project.imageUrl || defaultProjectImageBySlug.get(project.slug) || null,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
  }));
  const featuredProjects = mappedProjects.filter(
    (project) => featuredProjectSlugs.has(project.slug) && Boolean(project.liveUrl)
  ).map((project) => ({ ...project, ...featuredProjectCopy[project.slug] }))
    .sort((first, second) => Number(second.slug === 'style-os') - Number(first.slug === 'style-os'));

  const hiddenPlatformSlugs = new Set(['sitecore', 'sitefinity']);

  const mergedSystems = new Map<string, { name: string; slug: string; logoUrl: string; sortOrder: number }>();

  systems
    .filter((system) => !hiddenPlatformSlugs.has(system.slug))
    .forEach((system) => {
      mergedSystems.set(system.slug, {
        name: system.name,
        slug: system.slug,
        logoUrl: system.logoUrl,
        sortOrder: system.sortOrder,
      });
    });

  defaultSystems
    .filter((system) => !hiddenPlatformSlugs.has(system.slug) && system.isActive)
    .forEach((system) => {
      if (!mergedSystems.has(system.slug)) {
        mergedSystems.set(system.slug, {
          name: system.name,
          slug: system.slug,
          logoUrl: system.logoUrl,
          sortOrder: system.sortOrder,
        });
      }
    });

  const platformLogos = Array.from(mergedSystems.values())
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((system) => ({
      name: system.name,
      slug: system.slug,
      logoUrl: system.logoUrl,
    }));

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Stephan El Khoury',
      jobTitle: 'Full-Stack Developer, SEO Expert, AI Search Expert',
      description:
        'Full-stack developer with expertise in technical SEO, AI search optimization, QA, and high-performance digital product delivery.',
      url: siteUrl,
      image: `${siteUrl}/images/profile/stephan-profile.jpg`,
      email: contact.email ? `mailto:${contact.email}` : undefined,
      telephone: contact.phone || undefined,
      sameAs: [
        'https://github.com/stephanelkhoury',
        'https://www.linkedin.com/in/stephanelkhoury',
        'https://www.instagram.com/stephanelkhoury',
        'https://x.com/stephanelkhoury',
      ],
      knowsAbout: [
        'Next.js',
        'React',
        'Node.js',
        'Quality Assurance',
        'Technical SEO',
        'AI Search Optimization',
        'Answer Engine Optimization',
        'Generative Engine Optimization',
        'Web Performance',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#services`,
      name: 'Stephan El Khoury Digital Services',
      url: siteUrl,
      image: `${siteUrl}/images/profile/stephan-profile.jpg`,
      description:
        'Professional services spanning full-stack development, technical SEO, AI search optimization, QA, and performance engineering.',
      provider: {
        '@id': `${siteUrl}/#person`,
      },
      areaServed: 'Worldwide',
      serviceType: [
        'Full-Stack Development',
        'Technical SEO',
        'AI Search Optimization',
        'AEO',
        'GEO',
        'Quality Assurance',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Stephan El Khoury',
      description:
        'Portfolio website for full-stack development, SEO expertise, AI search optimization, and digital product delivery.',
      publisher: {
        '@id': `${siteUrl}/#person`,
      },
      inLanguage: 'en-US',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${siteUrl}/#projects`,
      name: 'Featured Projects',
      itemListElement: featuredProjects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/projects/${project.slug}`,
        name: project.title,
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PremiumNavbar />
      <main id="main-content" className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <PremiumHero content={hero} />
        <PremiumProjects projects={featuredProjects} />
        <PremiumExperience content={experience} />
        <PremiumAbout content={about} />
        <PremiumServices content={services} />
        <PremiumSeoExpertise />
        <PremiumArchitecture content={architecture} />
        <PlatformLogos items={platformLogos} />
        <PremiumSkills content={skills} />
        <PremiumContact content={contact} />
      </main>
      <PremiumFooter />
    </>
  );
}
